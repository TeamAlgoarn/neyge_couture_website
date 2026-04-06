from fastapi import APIRouter, Depends, status

from app.core.dependencies import require_admin
from app.schemas.booking import VideoBookingCreateRequest
from app.services.booking_service import BookingService
from app.utils.response import success_response

router = APIRouter(tags=["Video Shopping"])


@router.post("/video-booking", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_video_booking(payload: VideoBookingCreateRequest):
    data = BookingService.create_booking(payload)
    return success_response("Video booking created successfully", data)


@router.get("/video-bookings", response_model=dict)
async def list_video_bookings(_: dict = Depends(require_admin)):
    data = BookingService.list_bookings()
    return success_response("Video bookings fetched successfully", data)