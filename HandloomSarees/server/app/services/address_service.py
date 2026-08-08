from fastapi import HTTPException, status

from app.repositories.address_repository import AddressRepository
from app.schemas.address import AddressCreateRequest, AddressUpdateRequest


class AddressService:
    @staticmethod
    def list_addresses(user_id: str) -> list[dict]:
        return AddressRepository.list_by_user(user_id)

    @staticmethod
    def get_address(address_id: str, user_id: str) -> dict:
        address = AddressRepository.get_by_id_and_user(address_id, user_id)
        if not address:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Address not found or access denied",
            )
        return address

    @staticmethod
    def create_address(user_id: str, payload: AddressCreateRequest) -> dict:
        data = payload.model_dump()
        data["user_id"] = user_id
        return AddressRepository.create(data)

    @staticmethod
    def update_address(address_id: str, user_id: str, payload: AddressUpdateRequest) -> dict:
        AddressService.get_address(address_id, user_id)

        data = payload.model_dump(exclude_unset=True)
        if not data:
            return AddressService.get_address(address_id, user_id)

        updated = AddressRepository.update(address_id, user_id, data)
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Failed to update address",
            )
        return updated

    @staticmethod
    def delete_address(address_id: str, user_id: str) -> bool:
        AddressService.get_address(address_id, user_id)

        success = AddressRepository.delete(address_id, user_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Failed to delete address",
            )
        return True

    @staticmethod
    def set_default_address(address_id: str, user_id: str) -> dict:
        AddressService.get_address(address_id, user_id)

        updated = AddressRepository.set_default(address_id, user_id)
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Failed to set default address",
            )
        return updated
