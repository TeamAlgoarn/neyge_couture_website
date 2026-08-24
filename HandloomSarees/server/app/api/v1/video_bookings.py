from fastapi import APIRouter, Depends, status

from app.core.dependencies import require_admin, get_current_user
from app.schemas.booking import (
    VideoBookingCreateRequest,
    VideoBookingStatusUpdateRequest,
)
from app.services.booking_service import BookingService
from app.utils.response import success_response

router = APIRouter(tags=["Video Shopping"])


@router.post("/video-booking", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_video_booking(payload: VideoBookingCreateRequest):
    data = BookingService.create_booking(payload)
    return success_response("Video booking created successfully", data)


@router.get("/video-bookings", response_model=dict)
async def list_video_bookings(_: dict = Depends(require_admin)):
    data = BookingService.list_all()
    return success_response("Video bookings fetched successfully", data)


@router.get("/my-video-bookings", response_model=dict)
async def list_my_video_bookings(current_user: dict = Depends(get_current_user)):
    email = (
        current_user.get("profile", {}).get("email")
        or current_user.get("auth", {}).get("email")
    )

    if not email:
        return success_response("User email not found", [])

    data = BookingService.list_bookings_by_email(email)
    return success_response("User video bookings fetched successfully", data)


@router.patch("/video-bookings/{booking_id}/status", response_model=dict)
async def update_video_booking_status(
    booking_id: str,
    payload: VideoBookingStatusUpdateRequest,
    _: dict = Depends(require_admin),
):
    data = BookingService.update_booking_status(booking_id, payload.status)
    return success_response("Video booking status updated successfully", data)