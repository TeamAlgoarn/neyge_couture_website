from pydantic import BaseModel, EmailStr, Field



class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    phone: str | None = Field(default=None, min_length=7, max_length=20)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


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