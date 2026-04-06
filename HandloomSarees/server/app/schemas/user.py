from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr

from app.models.user import Address, UserRole


class UserPublic(BaseModel):
    id: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    role: UserRole
    addresses: List[Address] = []
    wishlist: List[str] = []
    is_active: bool
    created_at: datetime
    updated_at: datetime


class UserInDB(BaseModel):
    id: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    password_hash: str
    role: UserRole
    addresses: List[Address] = []
    wishlist: List[str] = []
    is_active: bool
    created_at: datetime
    updated_at: datetime