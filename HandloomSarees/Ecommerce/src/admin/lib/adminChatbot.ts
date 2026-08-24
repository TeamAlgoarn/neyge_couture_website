import adminApi from "./adminApi";

export type ChatbotLeadStatus = "new" | "contacted" | "converted" | "closed";

export type ChatbotLead = {
  id: string;
  source: string;
  flow: "shop_sarees" | "video_shopping" | "custom_bulk" | "support";
  name: string;
  phone: string;
  email?: string | null;
  city?: string | null;
  occasion?: string | null;
  budget?: string | null;
  saree_type?: string | null;
  preferred_date?: string | null;
  preferred_time?: string | null;
  requirement_type?: string | null;
  approx_quantity?: string | null;
  message?: string | null;
  status: ChatbotLeadStatus;
  created_at: string;
};

export async function getChatbotLeads(params?: {
  flow?: string;
  status?: string;
}) {
  const res = await adminApi.get("/chatbot/leads", { params });
  return res.data.data as ChatbotLead[];
}

export async function updateChatbotLeadStatus(
  leadId: string,
  status: ChatbotLeadStatus
) {
  const res = await adminApi.patch(`/chatbot/leads/${leadId}/status`, {
    status,
  });
  return res.data.data as ChatbotLead;
}