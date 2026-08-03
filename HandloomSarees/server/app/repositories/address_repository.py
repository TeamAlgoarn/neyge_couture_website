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
    def _unset_other_defaults(user_id: str, exclude_address_id: str | None = None) -> None:
        client = get_supabase_admin()
        query = client.table("addresses").update({"is_default": False}).eq("user_id", user_id).eq("is_default", True)
        if exclude_address_id:
            query = query.neq("id", exclude_address_id)
        query.execute()

    @staticmethod
    def create(payload: dict) -> dict:
        user_id = payload["user_id"]
        client = get_supabase_admin()

        existing_addresses = AddressRepository.list_by_user(user_id)
        if not existing_addresses:
            payload["is_default"] = True
        elif payload.get("is_default"):
            AddressRepository._unset_other_defaults(user_id)

        result = client.table("addresses").insert(payload).execute()
        return result.data[0]

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

        try:
            client.rpc("delete_address_and_promote", {"target_user_id": user_id, "target_address_id": address_id}).execute()
        except Exception:
            was_default = existing.get("is_default", False)
            client.table("addresses").delete().eq("id", address_id).eq("user_id", user_id).execute()

            if was_default:
                remaining = AddressRepository.list_by_user(user_id)
                if remaining:
                    AddressRepository.set_default(remaining[0]["id"], user_id)

        return True

    @staticmethod
    def set_default(address_id: str, user_id: str) -> dict | None:
        client = get_supabase_admin()
        existing = AddressRepository.get_by_id_and_user(address_id, user_id)
        if not existing:
            return None

        client.rpc("set_default_address", {"target_user_id": user_id, "target_address_id": address_id}).execute()
        return AddressRepository.get_by_id_and_user(address_id, user_id)
