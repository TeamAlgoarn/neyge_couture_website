from typing import Any, Optional


class ChatbotRepository:
    def __init__(self, supabase):
        self.supabase = supabase
        self.table = "chatbot_leads"

    def create_lead(self, data: dict[str, Any]) -> dict[str, Any]:
        response = (
            self.supabase
            .table(self.table)
            .insert(data)
            .execute()
        )

        if not response.data:
            raise Exception("Failed to create chatbot lead")

        return response.data[0]

    def get_all_leads(
        self,
        flow: Optional[str] = None,
        status: Optional[str] = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[dict[str, Any]]:
        query = self.supabase.table(self.table).select("*")

        if flow:
            query = query.eq("flow", flow)

        if status:
            query = query.eq("status", status)

        response = (
            query
            .order("created_at", desc=True)
            .range(offset, offset + limit - 1)
            .execute()
        )

        return response.data or []

    def update_status(self, lead_id: str, status: str) -> dict[str, Any]:
        response = (
            self.supabase
            .table(self.table)
            .update({"status": status})
            .eq("id", lead_id)
            .execute()
        )

        if not response.data:
            raise Exception("Chatbot lead not found")

        return response.data[0]