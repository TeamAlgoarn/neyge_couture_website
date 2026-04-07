from fastapi import APIRouter, Depends, HTTPException, status

from app.core.dependencies import get_current_user, require_admin
from app.schemas.order import OrderCreateRequest
from app.services.order_service import OrderService
from app.services.payment_service import PaymentService
from app.utils.response import success_response

router = APIRouter(prefix="/orders", tags=["Orders"])


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


@router.post("/create", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_order_checkout(
    payload: OrderCreateRequest,
    current_user: dict = Depends(get_current_user),
):
    user_id = resolve_user_id(current_user)

    data = PaymentService.create_payment_order(
        user_id=user_id,
        shipping_address=payload.shipping_address.model_dump(),
    )
    return success_response("Order checkout initiated successfully", data)


@router.get("/user", response_model=dict)
async def list_user_orders(
    current_user: dict = Depends(get_current_user),
):
    user_id = resolve_user_id(current_user)
    print("CURRENT USER ID FOR /orders/user:", user_id)

    data = OrderService.list_user_orders(user_id)
    return success_response("User orders fetched successfully", data)


@router.get("/admin/all", response_model=dict)
async def list_all_orders_admin(
    current_user: dict = Depends(require_admin),
):
    data = OrderService.list_all_orders()
    return success_response("All orders fetched successfully", data)


@router.get("/admin/{order_id}", response_model=dict)
async def get_order_admin(
    order_id: str,
    current_user: dict = Depends(require_admin),
):
    data = OrderService.get_admin_order_by_id(order_id)
    return success_response("Order fetched successfully", data)


@router.get("/{order_id}", response_model=dict)
async def get_order(
    order_id: str,
    current_user: dict = Depends(get_current_user),
):
    user_id = resolve_user_id(current_user)
    data = OrderService.get_order_by_id(user_id, order_id)
    return success_response("Order fetched successfully", data)