import api from "@/api/client";

export const createChatbotLead = async (data: any) => {
  const res = await api.post("/chatbot/leads", data);
  return res.data;
};