from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field


BookingStatus = Literal["pending", "confirmed", "completed", "cancelled"]


class VideoBookingCreateRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    phone: str = Field(..., min_length=7, max_length=20)
    email: EmailStr
    occasion: str | None = Field(default=None, max_length=120)
    budget_range: str | None = Field(default=None, max_length=120)
    preferred_date: datetime
    notes: str | None = Field(default=None, max_length=3000)


class VideoBookingStatusUpdateRequest(BaseModel):
    status: BookingStatus


class VideoBookingResponse(BaseModel):
    id: str
    name: str
    phone: str
    email: str
    occasion: str | None = None
    budget_range: str | None = None
    preferred_date: datetime
    notes: str | None = None
    status: BookingStatus
    created_at: datetime