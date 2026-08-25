import hashlib
import hmac
import logging
import httpx
from fastapi import APIRouter, Depends, Request, HTTPException, Query, status
from fastapi.responses import PlainTextResponse

from app.core.config import settings
from app.core.dependencies import require_admin
from app.repositories.payment_repository import PaymentRepository

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/whatsapp", tags=["WhatsApp"])


def _verify_whatsapp_signature(raw_body: bytes, signature: str) -> None:
    """
    Verify WhatsApp webhook signature using HMAC-SHA256.
    Meta provides the signature in the X-Hub-Signature-256 header with prefix 'sha256='.
    """
    app_secret = settings.WHATSAPP_APP_SECRET
    if not app_secret:
        logger.error("WHATSAPP_APP_SECRET is not configured — rejecting webhook")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Webhook secret not configured",
        )

    if not signature:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing X-Hub-Signature-256 header",
        )

    if not signature.startswith("sha256="):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid signature format. Expected sha256=<hex_digest>",
        )

    sig_hash = signature[7:].strip()
    expected_hash = hmac.new(
        app_secret.encode("utf-8"),
        raw_body,
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(expected_hash, sig_hash):
        logger.warning("WhatsApp webhook signature verification failed")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid webhook signature",
        )


# ── Webhook Verification (GET) ─────────────────────────────────────────────
@router.get("/webhook")
async def verify_webhook(
    hub_mode: str = Query(None, alias="hub.mode"),
    hub_verify_token: str = Query(None, alias="hub.verify_token"),
    hub_challenge: str = Query(None, alias="hub.challenge"),
):
    verify_token = settings.WHATSAPP_WEBHOOK_VERIFY_TOKEN
    if not verify_token:
        logger.error("WHATSAPP_WEBHOOK_VERIFY_TOKEN is not configured — rejecting verification")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Webhook verify token not configured",
        )

    if hub_mode == "subscribe" and hub_verify_token and hmac.compare_digest(hub_verify_token, verify_token):
        return PlainTextResponse(content=hub_challenge or "")
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Verification failed")


# ── Webhook Receiver (POST) ────────────────────────────────────────────────
@router.post("/webhook")
async def receive_webhook(request: Request):
    raw_body = await request.body()
    signature = request.headers.get("X-Hub-Signature-256", "")

    if not signature:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing X-Hub-Signature-256 header",
        )

    _verify_whatsapp_signature(raw_body, signature)

    try:
        data = await request.json()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid JSON payload",
        )

    try:
        for entry in data.get("entry", []):
            for change in entry.get("changes", []):
                value = change.get("value", {})

                # 1. Handle incoming messages with source-prefixed deduplication key
                messages = value.get("messages", [])
                for message in messages:
                    msg_id = message.get("id")
                    dedupe_key = f"whatsapp:msg:{msg_id}" if msg_id else None

                    if dedupe_key:
                        try:
                            reserved = PaymentRepository.reserve_webhook_event(dedupe_key, "whatsapp.message")
                        except Exception as reserve_exc:
                            logger.error("Webhook reservation DB error for WhatsApp message %s: %s", dedupe_key, reserve_exc)
                            raise HTTPException(
                                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                                detail="Temporary reservation failure, please retry",
                            )

                        if not reserved:
                            logger.info("WhatsApp message %s already reserved/processed, skipping", dedupe_key)
                            continue

                    phone = message.get("from")
                    msg_type = message.get("type")
                    try:
                        if msg_type == "text":
                            text = message.get("text", {}).get("body", "").lower()
                            logger.info("WhatsApp message from %s: %s", phone, text)
                            # Smart auto reply
                            if any(word in text for word in ["hi", "hello", "hey", "namaste"]):
                                reply = "Hi! 👋 Welcome to Neyge Couture. How can we help you today?\n\nReply with:\n*SHOP* - Browse our collection\n*ORDER* - Track your order\n*HELP* - Get assistance"
                            elif "shop" in text or "saree" in text or "collection" in text:
                                reply = "🛍️ Explore our exclusive handloom saree collection at:\nwww.negyecouture.com\n\nWe have beautiful handcrafted sarees for every occasion!"
                            elif "order" in text or "track" in text:
                                reply = "📦 To track your order, please visit:\nwww.negyecouture.com\n\nOr share your Order ID and we will check the status for you."
                            elif "price" in text or "cost" in text or "rate" in text:
                                reply = "💰 Our sarees are priced from ₹1,500 onwards.\n\nVisit www.negyecouture.com to see our complete collection with prices."
                            else:
                                reply = "Thank you for contacting Neyge Couture! 🙏\n\nOur team will get back to you shortly.\n\nVisit us at: www.negyecouture.com"
                            await send_whatsapp_message(phone, reply)

                        if dedupe_key:
                            PaymentRepository.mark_webhook_event_processed(dedupe_key)
                    except Exception as e:
                        logger.exception("Error processing WhatsApp message %s: %s", dedupe_key, e)
                        if dedupe_key:
                            PaymentRepository.mark_webhook_event_failed(dedupe_key, str(e))
                        raise HTTPException(
                            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                            detail="Webhook processing failed, please retry",
                        )

                # 2. Handle message status updates (sent, delivered, read) with source-prefixed deduplication key
                statuses = value.get("statuses", [])
                for status_obj in statuses:
                    status_id = status_obj.get("id")
                    status_state = status_obj.get("status")
                    dedupe_key = (
                        f"whatsapp:status:{status_id}:{status_state}"
                        if status_id and status_state
                        else (f"whatsapp:status:{status_id}" if status_id else None)
                    )

                    if dedupe_key:
                        try:
                            reserved = PaymentRepository.reserve_webhook_event(dedupe_key, "whatsapp.status")
                        except Exception as reserve_exc:
                            logger.error("Webhook reservation DB error for WhatsApp status %s: %s", dedupe_key, reserve_exc)
                            raise HTTPException(
                                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                                detail="Temporary reservation failure, please retry",
                            )

                        if not reserved:
                            logger.info("WhatsApp status %s already reserved/processed, skipping", dedupe_key)
                            continue

                        try:
                            logger.info("WhatsApp status update %s: %s", status_id, status_state)
                            PaymentRepository.mark_webhook_event_processed(dedupe_key)
                        except Exception as e:
                            logger.exception("Error processing WhatsApp status %s: %s", dedupe_key, e)
                            PaymentRepository.mark_webhook_event_failed(dedupe_key, str(e))
                            raise HTTPException(
                                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                                detail="Webhook processing failed, please retry",
                            )

    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Unhandled WhatsApp webhook error: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Webhook processing failed, please retry",
        )

    return {"status": "ok"}


# ── Send Text Message ──────────────────────────────────────────────────────
async def send_whatsapp_message(to: str, message: str):
    url = f"https://graph.facebook.com/{settings.WHATSAPP_API_VERSION}/{settings.WHATSAPP_PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {settings.WHATSAPP_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": to,
        "type": "text",
        "text": {"body": message},
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, headers=headers)
        print(f"WhatsApp send response: {response.json()}")
        return response.json()


# ── Send Template Message ──────────────────────────────────────────────────
async def send_template_message(
    to: str,
    template_name: str,
    language: str = "en_US",
    components: list | None = None
):
    url = f"https://graph.facebook.com/{settings.WHATSAPP_API_VERSION}/{settings.WHATSAPP_PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {settings.WHATSAPP_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": to,
        "type": "template",
        "template": {
            "name": template_name,
            "language": {"code": language},
            "components": components or [],
        },
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, headers=headers)
        return response.json()


# ── Send Order Confirmation (API endpoint) ─────────────────────────────────
@router.post("/send-order-confirmation")
async def send_order_confirmation(
    phone: str,
    order_id: str,
    customer_name: str,
    amount: str,
    _: dict = Depends(require_admin),
):
    message = f"""Hi {customer_name}! 🎉

Your order has been confirmed at Neyge Couture.

Order ID: {order_id}
Amount Paid: ₹{amount}

We will notify you once your order is shipped.
Thank you for shopping with us! 🛍️

www.negyecouture.com"""
    result = await send_whatsapp_message(phone, message)
    return {"success": True, "data": result}


# ── Send Shipping Notification ─────────────────────────────────────────────
@router.post("/send-shipping-notification")
async def send_shipping_notification(
    phone: str,
    order_id: str,
    customer_name: str,
    tracking_id: str = "",
    _: dict = Depends(require_admin),
):
    message = f"""Hi {customer_name}! 🚚

Your Neyge Couture order has been shipped!

Order ID: {order_id}
{"Tracking ID: " + tracking_id if tracking_id else ""}

Your saree is on its way! 🎊
Thank you for shopping with us!

www.negyecouture.com"""
    result = await send_whatsapp_message(phone, message)
    return {"success": True, "data": result}
