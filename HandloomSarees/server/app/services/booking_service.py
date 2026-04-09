from fastapi import HTTPException, status

from app.repositories.booking_repository import BookingRepository
from app.schemas.booking import VideoBookingCreateRequest


class BookingService:
    @staticmethod
    def create_booking(payload: VideoBookingCreateRequest) -> dict:
        # Convert to JSON-safe dict so datetime becomes ISO string
        data = payload.model_dump(mode="json")

        if not data.get("status"):
            data["status"] = "pending"

        return BookingRepository.create(data)

    @staticmethod
    def list_all() -> list[dict]:
        return BookingRepository.list_all()

    @staticmethod
    def list_bookings_by_email(email: str) -> list[dict]:
        return BookingRepository.list_by_email(email)

    @staticmethod
    def update_booking_status(booking_id: str, new_status: str) -> dict:
        existing = BookingRepository.get_by_id(booking_id)
        if not existing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Video booking not found",
            )

        updated = BookingRepository.update_status(booking_id, new_status)
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update booking status",
            )

        return updated