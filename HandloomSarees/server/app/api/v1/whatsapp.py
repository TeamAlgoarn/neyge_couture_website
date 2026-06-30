import httpx
from fastapi import APIRouter, Request, HTTPException, Query
from fastapi.responses import PlainTextResponse
from app.core.config import settings

router = APIRouter(prefix="/whatsapp", tags=["WhatsApp"])


# ── Webhook Verification (GET) ─────────────────────────────────────────────
@router.get("/webhook")
async def verify_webhook(
    hub_mode: str = Query(alias="hub.mode"),
    hub_verify_token: str = Query(alias="hub.verify_token"),
    hub_challenge: str = Query(alias="hub.challenge"),
):
    if hub_mode == "subscribe" and hub_verify_token == settings.WHATSAPP_WEBHOOK_VERIFY_TOKEN:
        return PlainTextResponse(content=hub_challenge)
    raise HTTPException(status_code=403, detail="Verification failed")


# ── Webhook Receiver (POST) ────────────────────────────────────────────────
@router.post("/webhook")
async def receive_webhook(request: Request):
    data = await request.json()
    try:
        for entry in data.get("entry", []):
            for change in entry.get("changes", []):
                value = change.get("value", {})
                messages = value.get("messages", [])
                for message in messages:
                    phone = message.get("from")
                    msg_type = message.get("type")
                    if msg_type == "text":
                        text = message.get("text", {}).get("body", "").lower()
                        print(f"Message from {phone}: {text}")
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
    except Exception as e:
        print(f"Webhook error: {e}")
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
    components: list = []
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
            "components": components,
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