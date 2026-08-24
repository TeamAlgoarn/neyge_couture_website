from app.core.database import get_supabase_admin


class AddressRepository:
    @staticmethod
    def list_by_user(user_id: str) -> list[dict]:
        client = get_supabase_admin()
        result = (
            client.table("addresses")
            .select("*")
            .eq("user_id", user_id)
            .order("is_default", desc=True)
            .order("created_at", desc=True)
            .execute()
        )
        return result.data or []

    @staticmethod
    def get_by_id_and_user(address_id: str, user_id: str) -> dict | None:
        client = get_supabase_admin()
        result = (
            client.table("addresses")
            .select("*")
            .eq("id", address_id)
            .eq("user_id", user_id)
            .limit(1)
            .execute()
        )
        return result.data[0] if result.data else None

    @staticmethod
    def create(payload: dict) -> dict:
        user_id = payload["user_id"]
        client = get_supabase_admin()

        existing_addresses = AddressRepository.list_by_user(user_id)
        is_first_address = not existing_addresses
        wants_default = payload.get("is_default", False)

        # For first address, always set as default
        if is_first_address:
            payload["is_default"] = True

        # Insert the address (without is_default if not first, to avoid partial-unique conflict)
        if not is_first_address and wants_default:
            payload["is_default"] = False  # insert as non-default first

        result = client.table("addresses").insert(payload).execute()
        new_address = result.data[0]

        # Then atomically set as default via RPC if needed
        if not is_first_address and wants_default:
            client.rpc(
                "set_default_address",
                {"target_user_id": user_id, "target_address_id": new_address["id"]},
            ).execute()
            new_address = AddressRepository.get_by_id_and_user(new_address["id"], user_id) or new_address

        return new_address

    @staticmethod
    def update(address_id: str, user_id: str, payload: dict) -> dict | None:
        client = get_supabase_admin()
        existing = AddressRepository.get_by_id_and_user(address_id, user_id)
        if not existing:
            return None

        if payload.get("is_default"):
            AddressRepository.set_default(address_id, user_id)

        result = (
            client.table("addresses")
            .update(payload)
            .eq("id", address_id)
            .eq("user_id", user_id)
            .execute()
        )
        return result.data[0] if result.data else None

    @staticmethod
    def delete(address_id: str, user_id: str) -> bool:
        client = get_supabase_admin()
        existing = AddressRepository.get_by_id_and_user(address_id, user_id)
        if not existing:
            return False

        client.rpc(
            "delete_address_and_promote",
            {"target_user_id": user_id, "target_address_id": address_id},
        ).execute()

        return True

    @staticmethod
    def set_default(address_id: str, user_id: str) -> dict | None:
        client = get_supabase_admin()
        existing = AddressRepository.get_by_id_and_user(address_id, user_id)
        if not existing:
            return None

        client.rpc("set_default_address", {"target_user_id": user_id, "target_address_id": address_id}).execute()
        return AddressRepository.get_by_id_and_user(address_id, user_id)
