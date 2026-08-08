from typing import Optional
from fastapi import APIRouter, Depends, Query

from app.core.dependencies import require_admin
from app.core.database import get_supabase_admin
from app.repositories.chatbot_repository import ChatbotRepository
from app.services.chatbot_service import ChatbotService
from app.schemas.chatbot import ChatbotLeadCreate, ChatbotLeadUpdateStatus

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])


def get_chatbot_service():
    supabase = get_supabase_admin()
    repository = ChatbotRepository(supabase)
    return ChatbotService(repository)


@router.post("/leads")
def create_chatbot_lead(
    payload: ChatbotLeadCreate,
    service: ChatbotService = Depends(get_chatbot_service),
):
    lead = service.create_lead(payload)

    return {
        "success": True,
        "message": "Chatbot lead created successfully",
        "data": lead,
    }


@router.get("/leads")
def get_chatbot_leads(
    flow: Optional[str] = Query(default=None),
    status: Optional[str] = Query(default=None),
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    service: ChatbotService = Depends(get_chatbot_service),
    _: dict = Depends(require_admin),
):
    leads = service.get_leads(
        flow=flow,
        status=status,
        limit=limit,
        offset=offset,
    )

    return {
        "success": True,
        "message": "Chatbot leads fetched successfully",
        "data": leads,
    }


@router.patch("/leads/{lead_id}/status")
def update_chatbot_lead_status(
    lead_id: str,
    payload: ChatbotLeadUpdateStatus,
    service: ChatbotService = Depends(get_chatbot_service),
    _: dict = Depends(require_admin),
):
    lead = service.update_status(lead_id, payload.status.value)

    return {
        "success": True,
        "message": "Chatbot lead status updated successfully",
        "data": lead,
    }
