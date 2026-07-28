import uuid
from datetime import datetime
from postgrest.exceptions import APIError
from app.core.database import get_supabase_admin


class AddressRepository:
    _in_memory_addresses: dict[str, list[dict]] = {}

    @staticmethod
    def list_by_user(user_id: str) -> list[dict]:
        try:
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
        except APIError as e:
            if getattr(e, "code", "") == "PGRST205" or "addresses" in str(e):
                user_list = AddressRepository._in_memory_addresses.get(user_id, [])
                return sorted(user_list, key=lambda x: (not x.get("is_default", False), x.get("created_at", "")), reverse=True)
            raise e

    @staticmethod
    def get_by_id_and_user(address_id: str, user_id: str) -> dict | None:
        try:
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
        except APIError as e:
            if getattr(e, "code", "") == "PGRST205" or "addresses" in str(e):
                user_list = AddressRepository._in_memory_addresses.get(user_id, [])
                for addr in user_list:
                    if addr.get("id") == address_id:
                        return addr
                return None
            raise e

    @staticmethod
    def _unset_other_defaults(user_id: str, exclude_address_id: str | None = None) -> None:
        try:
            client = get_supabase_admin()
            query = client.table("addresses").update({"is_default": False}).eq("user_id", user_id)
            if exclude_address_id:
                query = query.neq("id", exclude_address_id)
            query.execute()
        except APIError as e:
            if getattr(e, "code", "") == "PGRST205" or "addresses" in str(e):
                user_list = AddressRepository._in_memory_addresses.get(user_id, [])
                for addr in user_list:
                    if exclude_address_id is None or addr.get("id") != exclude_address_id:
                        addr["is_default"] = False
                return
            raise e

    @staticmethod
    def create(payload: dict) -> dict:
        user_id = payload["user_id"]
        
        try:
            client = get_supabase_admin()
            existing_addresses = AddressRepository.list_by_user(user_id)
            
            if not existing_addresses:
                payload["is_default"] = True
            elif payload.get("is_default"):
                AddressRepository._unset_other_defaults(user_id)

            result = client.table("addresses").insert(payload).execute()
            return result.data[0]
        except APIError as e:
            if getattr(e, "code", "") == "PGRST205" or "addresses" in str(e):
                user_list = AddressRepository._in_memory_addresses.setdefault(user_id, [])
                if not user_list:
                    payload["is_default"] = True
                elif payload.get("is_default"):
                    for item in user_list:
                        item["is_default"] = False

                now_str = datetime.utcnow().isoformat()
                new_address = {
                    "id": str(uuid.uuid4()),
                    "user_id": user_id,
                    "full_name": payload.get("full_name"),
                    "phone": payload.get("phone"),
                    "line1": payload.get("line1"),
                    "line2": payload.get("line2"),
                    "city": payload.get("city"),
                    "state": payload.get("state"),
                    "postal_code": payload.get("postal_code"),
                    "country": payload.get("country", "India"),
                    "is_default": payload.get("is_default", False),
                    "created_at": now_str,
                    "updated_at": now_str,
                }
                user_list.append(new_address)
                return new_address
            raise e

    @staticmethod
    def update(address_id: str, user_id: str, payload: dict) -> dict | None:
        try:
            client = get_supabase_admin()
            existing = AddressRepository.get_by_id_and_user(address_id, user_id)
            if not existing:
                return None

            if payload.get("is_default"):
                AddressRepository._unset_other_defaults(user_id, exclude_address_id=address_id)

            result = (
                client.table("addresses")
                .update(payload)
                .eq("id", address_id)
                .eq("user_id", user_id)
                .execute()
            )
            return result.data[0] if result.data else None
        except APIError as e:
            if getattr(e, "code", "") == "PGRST205" or "addresses" in str(e):
                existing = AddressRepository.get_by_id_and_user(address_id, user_id)
                if not existing:
                    return None
                if payload.get("is_default"):
                    AddressRepository._unset_other_defaults(user_id, exclude_address_id=address_id)
                existing.update(payload)
                existing["updated_at"] = datetime.utcnow().isoformat()
                return existing
            raise e

    @staticmethod
    def delete(address_id: str, user_id: str) -> bool:
        try:
            client = get_supabase_admin()
            existing = AddressRepository.get_by_id_and_user(address_id, user_id)
            if not existing:
                return False

            was_default = existing.get("is_default", False)

            client.table("addresses").delete().eq("id", address_id).eq("user_id", user_id).execute()

            if was_default:
                remaining = AddressRepository.list_by_user(user_id)
                if remaining:
                    client.table("addresses").update({"is_default": True}).eq("id", remaining[0]["id"]).execute()

            return True
        except APIError as e:
            if getattr(e, "code", "") == "PGRST205" or "addresses" in str(e):
                user_list = AddressRepository._in_memory_addresses.get(user_id, [])
                target = None
                for addr in user_list:
                    if addr.get("id") == address_id:
                        target = addr
                        break
                if not target:
                    return False

                was_default = target.get("is_default", False)
                user_list.remove(target)

                if was_default and user_list:
                    user_list[0]["is_default"] = True

                return True
            raise e

    @staticmethod
    def set_default(address_id: str, user_id: str) -> dict | None:
        try:
            client = get_supabase_admin()
            existing = AddressRepository.get_by_id_and_user(address_id, user_id)
            if not existing:
                return None

            AddressRepository._unset_other_defaults(user_id, exclude_address_id=address_id)
            
            result = (
                client.table("addresses")
                .update({"is_default": True})
                .eq("id", address_id)
                .eq("user_id", user_id)
                .execute()
            )
            return result.data[0] if result.data else None
        except APIError as e:
            if getattr(e, "code", "") == "PGRST205" or "addresses" in str(e):
                existing = AddressRepository.get_by_id_and_user(address_id, user_id)
                if not existing:
                    return None
                AddressRepository._unset_other_defaults(user_id, exclude_address_id=address_id)
                existing["is_default"] = True
                existing["updated_at"] = datetime.utcnow().isoformat()
                return existing
            raise e
