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

router = APIRouter(prefix="/instagram", tags=["Instagram"])

INSTAGRAM_GRAPH_HOST = "https://graph.instagram.com"
META_HTTP_TIMEOUT = httpx.Timeout(10.0, connect=5.0)


class InstagramProviderError(RuntimeError):
    """Safe outbound-provider error that contains no Meta response payload."""


def _instagram_graph_url(path: str) -> str:
    return (
        f"{INSTAGRAM_GRAPH_HOST}/{settings.INSTAGRAM_API_VERSION}/"
        f"{path.lstrip('/')}"
    )


async def _instagram_api_request(
    method: str,
    path: str,
    *,
    json_payload: dict | None = None,
    params: dict | None = None,
) -> dict:
    url = _instagram_graph_url(path)
    headers = {
        "Authorization": f"Bearer {settings.INSTAGRAM_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=META_HTTP_TIMEOUT) as client:
            response = await client.request(
                method,
                url,
                json=json_payload,
                params=params,
                headers=headers,
            )
            response.raise_for_status()
    except httpx.HTTPStatusError as exc:
        logger.warning(
            "Instagram Graph API returned a non-success response status_code=%s",
            exc.response.status_code,
        )
        raise InstagramProviderError("Instagram provider rejected the request") from exc
    except httpx.RequestError as exc:
        logger.warning(
            "Instagram Graph API request failed error_type=%s",
            type(exc).__name__,
        )
        raise InstagramProviderError("Instagram provider is temporarily unavailable") from exc

    try:
        return response.json()
    except ValueError as exc:
        logger.warning("Instagram Graph API returned an invalid success response")
        raise InstagramProviderError("Instagram provider returned an invalid response") from exc


def _verify_instagram_signature(raw_body: bytes, signature: str) -> None:
    """
    Verify Instagram webhook signature using HMAC-SHA256.
    Meta provides the signature in the X-Hub-Signature-256 header with prefix 'sha256='.
    """
    app_secret = settings.INSTAGRAM_APP_SECRET
    if not app_secret:
        logger.error("INSTAGRAM_APP_SECRET is not configured — rejecting webhook")
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
        logger.warning("Instagram webhook signature verification failed")
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
    if not settings.INSTAGRAM_ENABLED:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Instagram integration is disabled for this environment",
        )

    verify_token = settings.INSTAGRAM_WEBHOOK_VERIFY_TOKEN
    if not verify_token:
        logger.error("INSTAGRAM_WEBHOOK_VERIFY_TOKEN is not configured — rejecting verification")
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
    if not settings.INSTAGRAM_ENABLED:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Instagram integration is disabled for this environment",
        )

    raw_body = await request.body()
    signature = request.headers.get("X-Hub-Signature-256", "")

    if not signature:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing X-Hub-Signature-256 header",
        )

    _verify_instagram_signature(raw_body, signature)

    try:
        data = await request.json()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid JSON payload",
        )

    try:
        for entry in data.get("entry", []):
            # 1. Handle DMs with source-prefixed deduplication key
            for messaging_event in entry.get("messaging", []):
                sender_id = messaging_event.get("sender", {}).get("id")
                message = messaging_event.get("message", {})
                text = message.get("text", "")
                msg_id = message.get("mid") or messaging_event.get("id")

                # Ignore echoes, messages from the business account itself, and
                # non-text events. Only legitimate inbound DMs receive a reply.
                if (
                    not sender_id
                    or not text
                    or message.get("is_echo") is True
                    or message.get("is_self") is True
                    or message.get("is_deleted") is True
                    or message.get("is_unsupported") is True
                    or sender_id == settings.INSTAGRAM_BUSINESS_ACCOUNT_ID
                ):
                    continue

                dedupe_key = f"instagram:dm:{msg_id}" if msg_id else None

                if dedupe_key:
                    try:
                        reserved = PaymentRepository.reserve_webhook_event(dedupe_key, "instagram.message")
                    except Exception as reserve_exc:
                        logger.error("Webhook reservation DB error for Instagram message %s: %s", dedupe_key, reserve_exc)
                        raise HTTPException(
                            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                            detail="Temporary reservation failure, please retry",
                        )

                    if not reserved:
                        logger.info("Instagram message %s already reserved/processed, skipping", dedupe_key)
                        continue

                try:
                    logger.info(
                        "Instagram inbound DM received event=%s",
                        dedupe_key or "unidentified",
                    )
                    await send_instagram_reply(sender_id, get_auto_reply(text.lower()))
                    if dedupe_key:
                        PaymentRepository.mark_webhook_event_processed(dedupe_key)
                except Exception as e:
                    logger.exception("Error processing Instagram DM %s: %s", dedupe_key, e)
                    if dedupe_key:
                        PaymentRepository.mark_webhook_event_failed(dedupe_key, str(e))
                    raise HTTPException(
                        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                        detail="Webhook processing failed, please retry",
                    )

            # 2. Instagram Login comment webhooks place field/value on the
            # entry itself (not in the Facebook Login `changes` envelope).
            if entry.get("field") == "comments":
                value = entry.get("value", {})
                comment_id = value.get("id")
                dedupe_key = f"instagram:comment:{comment_id}" if comment_id else None

                if dedupe_key:
                    try:
                        reserved = PaymentRepository.reserve_webhook_event(dedupe_key, "instagram.comment")
                    except Exception as reserve_exc:
                        logger.error("Webhook reservation DB error for Instagram comment %s: %s", dedupe_key, reserve_exc)
                        raise HTTPException(
                            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                            detail="Temporary reservation failure, please retry",
                        )

                    if not reserved:
                        logger.info("Instagram comment %s already reserved/processed, skipping", dedupe_key)
                        continue

                try:
                    logger.info(
                        "Instagram comment webhook received event=%s",
                        dedupe_key or "unidentified",
                    )
                    # Automatic public comment replies intentionally remain disabled.
                    if dedupe_key:
                        PaymentRepository.mark_webhook_event_processed(dedupe_key)
                except Exception as e:
                    logger.exception("Error processing Instagram comment %s: %s", dedupe_key, e)
                    if dedupe_key:
                        PaymentRepository.mark_webhook_event_failed(dedupe_key, str(e))
                    raise HTTPException(
                        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                        detail="Webhook processing failed, please retry",
                    )

    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Unhandled Instagram webhook error: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Webhook processing failed, please retry",
        )

    return {"status": "ok"}


def get_auto_reply(text: str) -> str:
    if any(word in text for word in ["hi", "hello", "hey"]):
        return "Hi! 👋 Welcome to Neyge Couture. How can we help you today?\n\nVisit www.neygecouture.com to explore our handloom saree collection!"
    elif "price" in text or "cost" in text:
        return "💰 Our sarees start from ₹1,500 onwards. Visit www.neygecouture.com to see our full collection with prices!"
    elif "shop" in text or "saree" in text or "collection" in text:
        return "🛍️ Explore our exclusive handloom saree collection at www.neygecouture.com"
    elif "order" in text or "track" in text:
        return "📦 To track your order, please visit www.neygecouture.com or share your Order ID with us."
    else:
        return "Thank you for reaching out to Neyge Couture! 🙏 Our team will get back to you shortly.\n\nwww.neygecouture.com"


# ── Send DM Reply ───────────────────────────────────────────────────────────
async def send_instagram_reply(recipient_id: str, message: str):
    if not settings.INSTAGRAM_ENABLED:
        logger.info("Instagram integration disabled; skipped outbound reply")
        return {"status": "disabled", "message": "Instagram integration is disabled"}

    payload = {
        "recipient": {"id": recipient_id},
        "message": {"text": message},
    }
    return await _instagram_api_request(
        "POST",
        f"{settings.INSTAGRAM_BUSINESS_ACCOUNT_ID}/messages",
        json_payload=payload,
    )


# ── Reply to Comment ─────────────────────────────────────────────────────────
async def reply_to_comment(comment_id: str, message: str):
    if not settings.INSTAGRAM_ENABLED:
        logger.info("Instagram integration disabled; skipped comment reply")
        return {"status": "disabled", "message": "Instagram integration is disabled"}

    payload = {"message": message}
    return await _instagram_api_request(
        "POST",
        f"{comment_id}/replies",
        json_payload=payload,
    )


# ── Get Instagram Media/Posts (for website feed) ─────────────────────────────
@router.get("/media")
async def get_instagram_media(limit: int = 6):
    if not settings.INSTAGRAM_ENABLED:
        return {"success": True, "data": []}

    params = {
        "fields": "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp",
        "limit": limit,
    }
    try:
        data = await _instagram_api_request(
            "GET",
            f"{settings.INSTAGRAM_BUSINESS_ACCOUNT_ID}/media",
            params=params,
        )
    except InstagramProviderError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Instagram provider could not retrieve media",
        ) from exc
    return {"success": True, "data": data.get("data", [])}


# ── Send Manual Message (for admin use) ───────────────────────────────────────
@router.post("/send-message")
async def send_manual_message(
    recipient_id: str,
    message: str,
    _: dict = Depends(require_admin),
):
    try:
        result = await send_instagram_reply(recipient_id, message)
    except InstagramProviderError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Instagram provider could not send the message",
        ) from exc
    return {"success": True, "data": result}
