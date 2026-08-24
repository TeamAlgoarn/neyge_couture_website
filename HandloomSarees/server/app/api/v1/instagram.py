import httpx
from fastapi import APIRouter, Depends, Request, HTTPException, Query
from fastapi.responses import PlainTextResponse

from app.core.config import settings
from app.core.dependencies import require_admin

router = APIRouter(prefix="/instagram", tags=["Instagram"])

GRAPH_URL = f"https://graph.facebook.com/{settings.INSTAGRAM_API_VERSION}"


# ── Webhook Verification (GET) ─────────────────────────────────────────────
@router.get("/webhook")
async def verify_webhook(
    hub_mode: str = Query(alias="hub.mode"),
    hub_verify_token: str = Query(alias="hub.verify_token"),
    hub_challenge: str = Query(alias="hub.challenge"),
):
    if hub_mode == "subscribe" and hub_verify_token == settings.INSTAGRAM_WEBHOOK_VERIFY_TOKEN:
        return PlainTextResponse(content=hub_challenge)
    raise HTTPException(status_code=403, detail="Verification failed")


# ── Webhook Receiver (POST) ────────────────────────────────────────────────
@router.post("/webhook")
async def receive_webhook(request: Request):
    data = await request.json()
    try:
        for entry in data.get("entry", []):
            # Handle DMs
            for messaging_event in entry.get("messaging", []):
                sender_id = messaging_event.get("sender", {}).get("id")
                message = messaging_event.get("message", {})
                text = message.get("text", "")

                if sender_id and text:
                    print(f"Instagram DM from {sender_id}: {text}")
                    await send_instagram_reply(sender_id, get_auto_reply(text.lower()))

            # Handle comments
            for change in entry.get("changes", []):
                if change.get("field") == "comments":
                    value = change.get("value", {})
                    comment_text = value.get("text", "")
                    comment_id = value.get("id")
                    print(f"Instagram comment: {comment_text}")
                    # Optional: auto reply to comments
                    # await reply_to_comment(comment_id, "Thanks for your comment! DM us for more details 💬")

    except Exception as e:
        print(f"Instagram webhook error: {e}")
    return {"status": "ok"}


def get_auto_reply(text: str) -> str:
    if any(word in text for word in ["hi", "hello", "hey"]):
        return "Hi! 👋 Welcome to Neyge Couture. How can we help you today?\n\nVisit www.negyecouture.com to explore our handloom saree collection!"
    elif "price" in text or "cost" in text:
        return "💰 Our sarees start from ₹1,500 onwards. Visit www.negyecouture.com to see our full collection with prices!"
    elif "shop" in text or "saree" in text or "collection" in text:
        return "🛍️ Explore our exclusive handloom saree collection at www.negyecouture.com"
    elif "order" in text or "track" in text:
        return "📦 To track your order, please visit www.negyecouture.com or share your Order ID with us."
    else:
        return "Thank you for reaching out to Neyge Couture! 🙏 Our team will get back to you shortly.\n\nwww.negyecouture.com"


# ── Send DM Reply ───────────────────────────────────────────────────────────
async def send_instagram_reply(recipient_id: str, message: str):
    url = f"{GRAPH_URL}/{settings.INSTAGRAM_BUSINESS_ACCOUNT_ID}/messages"
    headers = {
        "Authorization": f"Bearer {settings.INSTAGRAM_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "recipient": {"id": recipient_id},
        "message": {"text": message},
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, headers=headers)
        print(f"Instagram send response: {response.json()}")
        return response.json()


# ── Reply to Comment ─────────────────────────────────────────────────────────
async def reply_to_comment(comment_id: str, message: str):
    url = f"{GRAPH_URL}/{comment_id}/replies"
    headers = {
        "Authorization": f"Bearer {settings.INSTAGRAM_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {"message": message}
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, headers=headers)
        return response.json()


# ── Get Instagram Media/Posts (for website feed) ─────────────────────────────
@router.get("/media")
async def get_instagram_media(limit: int = 6):
    url = f"{GRAPH_URL}/{settings.INSTAGRAM_BUSINESS_ACCOUNT_ID}/media"
    params = {
        "fields": "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp",
        "limit": limit,
        "access_token": settings.INSTAGRAM_ACCESS_TOKEN,
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        data = response.json()
        return {"success": True, "data": data.get("data", [])}


# ── Send Manual Message (for admin use) ───────────────────────────────────────
@router.post("/send-message")
async def send_manual_message(
    recipient_id: str,
    message: str,
    _: dict = Depends(require_admin),
):
    result = await send_instagram_reply(recipient_id, message)
    return {"success": True, "data": result}
