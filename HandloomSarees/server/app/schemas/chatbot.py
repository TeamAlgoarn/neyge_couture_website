from datetime import date, datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field, EmailStr


class ChatbotLeadFlow(str, Enum):
    shop_sarees = "shop_sarees"
    video_shopping = "video_shopping"
    custom_bulk = "custom_bulk"
    support = "support"


class ChatbotLeadStatus(str, Enum):
    new = "new"
    contacted = "contacted"
    converted = "converted"
    closed = "closed"


class ChatbotLeadCreate(BaseModel):
    source: str = Field(default="chatbot")
    flow: ChatbotLeadFlow

    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=7, max_length=20)
    email: Optional[EmailStr] = None

    city: Optional[str] = Field(default=None, max_length=100)
    occasion: Optional[str] = Field(default=None, max_length=100)
    budget: Optional[str] = Field(default=None, max_length=100)
    saree_type: Optional[str] = Field(default=None, max_length=100)

    preferred_date: Optional[date] = None
    preferred_time: Optional[str] = Field(default=None, max_length=100)

    requirement_type: Optional[str] = Field(default=None, max_length=100)
    approx_quantity: Optional[str] = Field(default=None, max_length=100)
    message: Optional[str] = Field(default=None, max_length=1000)


class ChatbotLeadUpdateStatus(BaseModel):
    status: ChatbotLeadStatus


class ChatbotLeadResponse(BaseModel):
    id: str
    source: str
    flow: str
    name: str
    phone: str
    email: Optional[str] = None
    city: Optional[str] = None
    occasion: Optional[str] = None
    budget: Optional[str] = None
    saree_type: Optional[str] = None
    preferred_date: Optional[date] = None
    preferred_time: Optional[str] = None
    requirement_type: Optional[str] = None
    approx_quantity: Optional[str] = None
    message: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime