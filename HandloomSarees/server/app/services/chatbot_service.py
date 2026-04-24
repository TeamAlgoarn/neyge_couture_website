from datetime import datetime, timezone
from fastapi import HTTPException, status

from app.repositories.chatbot_repository import ChatbotRepository
from app.schemas.chatbot import ChatbotLeadCreate


class ChatbotService:
    def __init__(self, repository: ChatbotRepository):
        self.repository = repository

    def create_lead(self, payload: ChatbotLeadCreate):
        data = payload.model_dump(mode="json", exclude_none=True)

        data["source"] = "chatbot"
        data["status"] = "new"

        if payload.flow == "video_shopping":
            if not payload.preferred_date or not payload.preferred_time:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Preferred date and time are required for video shopping",
                )

        if payload.flow == "custom_bulk":
            if not payload.city or not payload.approx_quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="City and approx quantity are required for custom/bulk enquiry",
                )

        try:
            return self.repository.create_lead(data)
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(exc),
            )

    def get_leads(self, flow=None, status=None, limit=100, offset=0):
        return self.repository.get_all_leads(
            flow=flow,
            status=status,
            limit=limit,
            offset=offset,
        )

    def update_status(self, lead_id: str, status_value: str):
        try:
            return self.repository.update_status(lead_id, status_value)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chatbot lead not found",
            )