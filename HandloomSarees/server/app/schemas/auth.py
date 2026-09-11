import re
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, model_validator



class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    phone: str | None = Field(default=None, min_length=7, max_length=20)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


def validate_managed_password(password: str) -> str:
    if len(password) < 12:
        raise ValueError("Password must be at least 12 characters long")
    if not re.search(r"[a-z]", password):
        raise ValueError("Password must include a lowercase letter")
    if not re.search(r"[A-Z]", password):
        raise ValueError("Password must include an uppercase letter")
    if not re.search(r"\d", password):
        raise ValueError("Password must include a number")
    if not re.search(r"[^A-Za-z0-9]", password):
        raise ValueError("Password must include a special character")
    return password


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    access_token: str = Field(..., min_length=20, max_length=4096)
    refresh_token: str = Field(..., min_length=20, max_length=4096)
    recovery_type: Literal["recovery"]
    new_password: str = Field(..., min_length=12, max_length=128)
    confirm_password: str = Field(..., min_length=12, max_length=128)

    @model_validator(mode="after")
    def validate_passwords(self):
        validate_managed_password(self.new_password)
        if self.new_password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., min_length=8, max_length=128)
    new_password: str = Field(..., min_length=12, max_length=128)
    confirm_password: str = Field(..., min_length=12, max_length=128)

    @model_validator(mode="after")
    def validate_passwords(self):
        validate_managed_password(self.new_password)
        if self.new_password != self.confirm_password:
            raise ValueError("Passwords do not match")
        if self.current_password == self.new_password:
            raise ValueError("New password must be different from the current password")
        return self


class AuthUserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    phone: str | None = None
    role: str
    is_active: bool


class AuthResponse(BaseModel):
    access_token: str | None = None
    refresh_token: str | None = None
    token_type: str = "bearer"
    user: AuthUserResponse
    email_confirmation_required: bool = False
