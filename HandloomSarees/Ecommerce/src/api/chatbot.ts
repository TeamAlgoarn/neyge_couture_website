import api from "@/api/client";

 
 
 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createChatbotLead = async (data: any) => {
  const res = await api.post("/chatbot/leads", data);
  return res.data;
};