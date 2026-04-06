from fastapi import APIRouter, Depends, status

from app.core.dependencies import get_current_user
from app.schemas.order import OrderCreateRequest
from app.services.order_service import OrderService
from app.services.payment_service import PaymentService
from app.utils.response import success_response

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/create", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_order_checkout(
    payload: OrderCreateRequest,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["profile"]["id"]
    data = PaymentService.create_payment_order(
        user_id=user_id,
        shipping_address=payload.shipping_address.model_dump(),
    )
    return success_response("Order checkout initiated successfully", data)


# IMPORTANT: keep /user above /{order_id}
@router.get("/user", response_model=dict)
async def list_user_orders(
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["profile"]["id"]
    data = OrderService.list_user_orders(user_id)
    return success_response("User orders fetched successfully", data)


@router.get("/{order_id}", response_model=dict)
async def get_order(
    order_id: str,
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["profile"]["id"]
    data = OrderService.get_order_by_id(user_id, order_id)
    return success_response("Order fetched successfully", data)