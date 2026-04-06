from datetime import datetime, timezone

from fastapi import HTTPException, status

from app.repositories.booking_repository import BookingRepository
from app.schemas.booking import VideoBookingCreateRequest


class BookingService:
    @staticmethod
    def create_booking(payload: VideoBookingCreateRequest) -> dict:
        preferred_date = payload.preferred_date

        if preferred_date.tzinfo is None:
            preferred_date = preferred_date.replace(tzinfo=timezone.utc)

        if preferred_date < datetime.now(timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Preferred date must be in the future",
            )

        booking = BookingRepository.create(
            {
                "name": payload.name.strip(),
                "phone": payload.phone.strip(),
                "email": payload.email.lower().strip(),
                "occasion": payload.occasion.strip() if payload.occasion else None,
                "budget_range": payload.budget_range.strip() if payload.budget_range else None,
                "preferred_date": preferred_date.isoformat(),
                "notes": payload.notes.strip() if payload.notes else None,
                "status": "pending",
            }
        )
        return booking

    @staticmethod
    def list_bookings() -> list[dict]:
        return BookingRepository.list_all()