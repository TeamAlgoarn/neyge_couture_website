# from fastapi import APIRouter, Depends, status

# from app.core.dependencies import get_current_user
# from app.schemas.payment import PaymentCreateOrderRequest, PaymentVerifyRequest
# from app.services.payment_service import PaymentService
# from app.utils.response import success_response

# router = APIRouter(prefix="/payment", tags=["Payments"])


# @router.post("/create-order", response_model=dict, status_code=status.HTTP_201_CREATED)
# async def create_payment_order(
#     payload: PaymentCreateOrderRequest,
#     current_user: dict = Depends(get_current_user),
# ):
#     user_id = current_user["profile"]["id"]
#     data = PaymentService.create_payment_order(
#         user_id=user_id,
#         shipping_address=payload.shipping_address.model_dump(),
#     )
#     return success_response("Payment order created successfully", data)


# @router.post("/verify", response_model=dict)
# async def verify_payment(
#     payload: PaymentVerifyRequest,
#     current_user: dict = Depends(get_current_user),
# ):
#     user_id = current_user["profile"]["id"]
#     data = PaymentService.verify_payment_and_finalize(
#         user_id=user_id,
#         razorpay_order_id=payload.razorpay_order_id,
#         razorpay_payment_id=payload.razorpay_payment_id,
#         razorpay_signature=payload.razorpay_signature,
#     )
#     return success_response("Payment verified successfully", data)




from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.core.dependencies import get_current_user
from app.services.payment_service import PaymentService
from app.utils.response import success_response

router = APIRouter(prefix="/payments", tags=["Payments"])


def resolve_user_id(current_user: dict) -> str:
    user_id = (
        current_user.get("profile", {}).get("id")
        or current_user.get("id")
        or current_user.get("user", {}).get("id")
        or current_user.get("user_id")
        or current_user.get("uid")
    )

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unable to resolve authenticated user id",
        )

    return str(user_id)


class PaymentVerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


@router.post("/verify", response_model=dict)
async def verify_payment(
    payload: PaymentVerifyRequest,
    current_user: dict = Depends(get_current_user),
):
    user_id = resolve_user_id(current_user)

    data = PaymentService.verify_payment_and_finalize(
        user_id=user_id,
        razorpay_order_id=payload.razorpay_order_id,
        razorpay_payment_id=payload.razorpay_payment_id,
        razorpay_signature=payload.razorpay_signature,
    )

    return success_response("Payment verified successfully", data)