from datetime import datetime, timezone
from enum import Enum
from typing import List, Optional

from beanie import Document, Indexed
from pydantic import BaseModel, EmailStr, Field


class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"


class Address(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=7, max_length=20)
    line1: str = Field(..., min_length=3, max_length=200)
    line2: Optional[str] = Field(default=None, max_length=200)
    city: str = Field(..., min_length=2, max_length=100)
    state: str = Field(..., min_length=2, max_length=100)
    postal_code: str = Field(..., min_length=3, max_length=20)
    country: str = Field(..., min_length=2, max_length=100)
    is_default: bool = False


class User(Document):
    name: str = Field(..., min_length=2, max_length=100)
    email: Indexed(EmailStr, unique=True)  # type: ignore[valid-type]
    phone: Optional[str] = Field(default=None, min_length=7, max_length=20)
    password_hash: str
    role: UserRole = UserRole.USER
    addresses: List[Address] = Field(default_factory=list)
    wishlist: List[str] = Field(default_factory=list)
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "users"
        indexes = [
            "role",
            "created_at",
            [("email", 1)],
        ]

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Abishek Pattar",
                "email": "abishek@example.com",
                "phone": "9876543210",
                "role": "user",
            }
        }

    async def save(self, *args, **kwargs):
        self.updated_at = datetime.now(timezone.utc)
        return await super().save(*args, **kwargs)