from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class AddressCreateRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120, description="Customer full name")
    phone: str = Field(..., min_length=7, max_length=20, description="Contact phone number")
    line1: str = Field(..., min_length=3, max_length=200, description="Address line 1 (house no, street, area)")
    line2: Optional[str] = Field(default=None, max_length=200, description="Address line 2 (landmark, optional)")
    city: str = Field(..., min_length=2, max_length=100, description="City name")
    state: str = Field(..., min_length=2, max_length=100, description="State name")
    postal_code: str = Field(..., min_length=4, max_length=20, description="Pincode / Postal code")
    country: str = Field(default="India", min_length=2, max_length=100, description="Country name")
    is_default: bool = Field(default=False, description="Set as default delivery address")


class AddressUpdateRequest(BaseModel):
    full_name: Optional[str] = Field(default=None, min_length=2, max_length=120)
    phone: Optional[str] = Field(default=None, min_length=7, max_length=20)
    line1: Optional[str] = Field(default=None, min_length=3, max_length=200)
    line2: Optional[str] = Field(default=None, max_length=200)
    city: Optional[str] = Field(default=None, min_length=2, max_length=100)
    state: Optional[str] = Field(default=None, min_length=2, max_length=100)
    postal_code: Optional[str] = Field(default=None, min_length=4, max_length=20)
    country: Optional[str] = Field(default=None, min_length=2, max_length=100)
    is_default: Optional[bool] = Field(default=None)


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
