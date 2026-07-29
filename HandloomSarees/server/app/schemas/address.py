from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator
import re


class AddressCreateRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120, description="Customer full name")
    phone: str = Field(..., description="Contact phone number (10-15 digits)")
    line1: str = Field(..., min_length=3, max_length=200, description="Address line 1")
    line2: Optional[str] = Field(default=None, max_length=200, description="Address line 2 (optional)")
    city: str = Field(..., min_length=2, max_length=100, description="City name")
    state: str = Field(..., min_length=2, max_length=100, description="State name")
    postal_code: str = Field(..., description="Pincode / Postal code (6 digits)")
    country: str = Field(default="India", min_length=2, max_length=100, description="Country name")
    is_default: bool = Field(default=False, description="Set as default delivery address")

    @field_validator("full_name", "line1", "city", "state", "country", mode="before")
    @classmethod
    def validate_non_whitespace_str(cls, v: str) -> str:
        if isinstance(v, str):
            v = v.strip()
            if not v:
                raise ValueError("Field cannot be empty or whitespace only")
        return v

    @field_validator("phone")
    @classmethod
    def validate_phone_format(cls, v: str) -> str:
        if isinstance(v, str):
            v = v.strip()
            if not re.match(r"^\+?[0-9]{10,15}$", v):
                raise ValueError("Phone number must contain 10 to 15 digits")
        return v

    @field_validator("postal_code")
    @classmethod
    def validate_pincode_format(cls, v: str) -> str:
        if isinstance(v, str):
            v = v.strip()
            if not re.match(r"^\d{6}$", v):
                raise ValueError("Pincode must be exactly 6 digits")
        return v


class AddressUpdateRequest(BaseModel):
    full_name: Optional[str] = Field(default=None, min_length=2, max_length=120)
    phone: Optional[str] = Field(default=None)
    line1: Optional[str] = Field(default=None, min_length=3, max_length=200)
    line2: Optional[str] = Field(default=None, max_length=200)
    city: Optional[str] = Field(default=None, min_length=2, max_length=100)
    state: Optional[str] = Field(default=None, min_length=2, max_length=100)
    postal_code: Optional[str] = Field(default=None)
    country: Optional[str] = Field(default=None, min_length=2, max_length=100)
    is_default: Optional[bool] = Field(default=None)

    @field_validator("full_name", "line1", "city", "state", "country", mode="before")
    @classmethod
    def validate_non_whitespace_str(cls, v: Optional[str]) -> Optional[str]:
        if isinstance(v, str):
            v = v.strip()
            if not v:
                raise ValueError("Field cannot be empty or whitespace only")
        return v

    @field_validator("phone")
    @classmethod
    def validate_phone_format(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and isinstance(v, str):
            v = v.strip()
            if not re.match(r"^\+?[0-9]{10,15}$", v):
                raise ValueError("Phone number must contain 10 to 15 digits")
        return v

    @field_validator("postal_code")
    @classmethod
    def validate_pincode_format(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and isinstance(v, str):
            v = v.strip()
            if not re.match(r"^\d{6}$", v):
                raise ValueError("Pincode must be exactly 6 digits")
        return v


class AddressResponse(BaseModel):
    id: str
    user_id: str
    full_name: str
    phone: str
    line1: str
    line2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    country: str
    is_default: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
