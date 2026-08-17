from fastapi import APIRouter

from app.api.v1.addresses import router as addresses_router
from app.api.v1.auth import router as auth_router
from app.api.v1.cart import router as cart_router
from app.api.v1.collections import router as collections_router
from app.api.v1.orders import router as orders_router
from app.api.v1.payments import router as payments_router
from app.api.v1.products import router as products_router
from app.api.v1.reviews import router as reviews_router
from app.api.v1.uploads import router as uploads_router
from app.api.v1.video_bookings import router as video_bookings_router
from app.api.v1.wishlist import router as wishlist_router
from app.api.v1 import festive_collections
from app.api.v1 import chatbot
from app.api.v1 import whatsapp          # ← ADD THIS
from app.api.v1 import instagram 
from app.api.v1 import webhooks

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(addresses_router)
api_router.include_router(collections_router)
api_router.include_router(products_router)
api_router.include_router(cart_router)
api_router.include_router(wishlist_router)
api_router.include_router(orders_router)
api_router.include_router(payments_router)
api_router.include_router(reviews_router)
api_router.include_router(video_bookings_router)
api_router.include_router(uploads_router)
api_router.include_router(festive_collections.router, tags=["Festive Collections"])
api_router.include_router(chatbot.router)
api_router.include_router(whatsapp.router)    # ← ADD THIS
api_router.include_router(instagram.router) 
api_router.include_router(webhooks.router)

@api_router.get("/health", tags=["Health"])
async def health_check():
    return {
        "success": True,
        "message": "Backend is healthy",
        "data": {
            "service": "Neyge Couture Backend",
            "status": "ok",
        },
    }