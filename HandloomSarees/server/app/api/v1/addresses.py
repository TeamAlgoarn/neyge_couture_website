from fastapi import APIRouter, Depends, HTTPException, status

from app.core.dependencies import get_current_user
from app.schemas.address import AddressCreateRequest, AddressUpdateRequest
from app.services.address_service import AddressService
from app.utils.response import success_response

router = APIRouter(prefix="/addresses", tags=["Addresses"])


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


@router.get("", response_model=dict)
async def list_addresses(current_user: dict = Depends(get_current_user)):
    user_id = resolve_user_id(current_user)
    data = AddressService.list_addresses(user_id)
    return success_response("Addresses fetched successfully", data)


@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_address(
    payload: AddressCreateRequest,
    current_user: dict = Depends(get_current_user),
):
    user_id = resolve_user_id(current_user)
    data = AddressService.create_address(user_id, payload)
    return success_response("Address created successfully", data)


@router.get("/{address_id}", response_model=dict)
async def get_address(
    address_id: str,
    current_user: dict = Depends(get_current_user),
):
    user_id = resolve_user_id(current_user)
    data = AddressService.get_address(address_id, user_id)
    return success_response("Address fetched successfully", data)


@router.put("/{address_id}", response_model=dict)
async def update_address(
    address_id: str,
    payload: AddressUpdateRequest,
    current_user: dict = Depends(get_current_user),
):
    user_id = resolve_user_id(current_user)
    data = AddressService.update_address(address_id, user_id, payload)
    return success_response("Address updated successfully", data)


@router.delete("/{address_id}", response_model=dict)
async def delete_address(
    address_id: str,
    current_user: dict = Depends(get_current_user),
):
    user_id = resolve_user_id(current_user)
    AddressService.delete_address(address_id, user_id)
    return success_response("Address deleted successfully", None)


@router.post("/{address_id}/default", response_model=dict)
async def set_default_address(
    address_id: str,
    current_user: dict = Depends(get_current_user),
):
    user_id = resolve_user_id(current_user)
    data = AddressService.set_default_address(address_id, user_id)
    return success_response("Default address updated successfully", data)
