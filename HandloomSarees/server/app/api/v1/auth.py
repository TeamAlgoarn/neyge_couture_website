# from fastapi import APIRouter, Depends, status

# from app.core.dependencies import get_current_user
# from app.schemas.auth import LoginRequest, RegisterRequest
# from app.services.auth_service import AuthService
# from app.utils.response import success_response

# router = APIRouter(prefix="/auth", tags=["Auth"])


# @router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
# async def register(payload: RegisterRequest):
#     result = AuthService.register(payload)

#     message = (
#         "User registered successfully"
#         if result.get("access_token")
#         else "User registered. Please verify your email before logging in."
#     )

#     return success_response(message=message, data=result)


# @router.post("/login", response_model=dict)
# async def login(payload: LoginRequest):
#     result = AuthService.login(payload)
#     return success_response(message="Login successful", data=result)


# @router.get("/me", response_model=dict)
# async def get_me(current_user: dict = Depends(get_current_user)):
#     return success_response(
#         message="Current user fetched successfully",
#         data=current_user["profile"],
#     )





from fastapi import APIRouter, Depends, Request, status

from app.core.dependencies import get_current_user, require_admin
from app.core.rate_limit import limiter
from app.schemas.auth import (
    ChangePasswordRequest,
    ForgotPasswordRequest,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
    WhatsAppPreferenceRequest,
)
from app.services.auth_service import AuthService
from app.utils.response import success_response

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def register(request: Request, payload: RegisterRequest):
    result = AuthService.register(payload)

    message = (
        "User registered successfully"
        if result.get("access_token")
        else "User registered. Please verify your email before logging in."
    )

    return success_response(message=message, data=result)


@router.post("/login", response_model=dict)
@limiter.limit("10/minute")
async def login(request: Request, payload: LoginRequest):
    result = AuthService.login(payload)
    return success_response(message="Login successful", data=result)


@router.post("/admin/login", response_model=dict)
@limiter.limit("5/minute")
async def admin_login(request: Request, payload: LoginRequest):
    result = AuthService.admin_login(payload)
    return success_response(message="Admin login successful", data=result)


@router.post("/forgot-password", response_model=dict)
@limiter.limit("3/minute")
async def forgot_password(request: Request, payload: ForgotPasswordRequest):
    AuthService.request_password_reset(str(payload.email))
    return success_response(
        message="If an account exists for this email, a password reset link has been sent."
    )


@router.post("/reset-password", response_model=dict)
@limiter.limit("5/minute")
async def reset_password(request: Request, payload: ResetPasswordRequest):
    AuthService.reset_admin_password(payload)
    return success_response(message="Password reset successfully")


@router.post("/change-password", response_model=dict)
@limiter.limit("5/minute")
async def change_password(
    request: Request,
    payload: ChangePasswordRequest,
    current_user: dict = Depends(require_admin),
):
    AuthService.change_admin_password(payload, current_user)
    return success_response(message="Password changed successfully")


@router.get("/me", response_model=dict)
async def get_me(current_user: dict = Depends(get_current_user)):
    return success_response(
        message="Current user fetched successfully",
        data=current_user["profile"],
    )


@router.patch("/preferences", response_model=dict)
@limiter.limit("10/minute")
async def update_preferences(
    request: Request,
    payload: WhatsAppPreferenceRequest,
    current_user: dict = Depends(get_current_user),
):
    profile = AuthService.update_whatsapp_preference(payload, current_user)
    return success_response(
        message="Notification preference updated successfully",
        data=profile,
    )
