import { useEffect, useMemo, useState } from "react";
import {
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  Filter,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import {
  getChatbotLeads,
  updateChatbotLeadStatus,
  type ChatbotLead,
  type ChatbotLeadStatus,
} from "@/admin/lib/adminChatbot";

const STATUS_OPTIONS: ChatbotLeadStatus[] = [
  "new",
  "contacted",
  "converted",
  "closed",
];

const FLOW_OPTIONS = [
  { value: "", label: "All Flows" },
  { value: "shop_sarees", label: "Shop Sarees" },
  { value: "video_shopping", label: "Video Shopping" },
  { value: "custom_bulk", label: "Custom / Bulk" },
  { value: "support", label: "Support" },
];

const statusClass: Record<ChatbotLeadStatus, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  contacted: "bg-yellow-50 text-yellow-700 border-yellow-200",
  converted: "bg-green-50 text-green-700 border-green-200",
  closed: "bg-gray-50 text-gray-700 border-gray-200",
};

function formatFlow(flow: string) {
  return flow
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function whatsappLink(phone: string, name?: string, flow?: string) {
  const cleaned = phone.replace(/\D/g, "");
  const finalPhone = cleaned.startsWith("91") ? cleaned : `91${cleaned}`;

  const readableFlow = flow ? formatFlow(flow) : "your enquiry";

  const message = encodeURIComponent(
    `Hi ${name || ""}, this is NEYGE Couture 🌸

We received your request for ${readableFlow}.

Our team will assist you in choosing the perfect saree based on your occasion, fabric, color and budget.

Please let us know a convenient time to connect.

Thank you,
NEYGE Couture`
  );

  return `https://wa.me/${finalPhone}?text=${message}`;
}

export default function AdminChatbotLeads() {
  const [leads, setLeads] = useState<ChatbotLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [flow, setFlow] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const fetchLeads = async () => {
    setLoading(true);

    try {
      const data = await getChatbotLeads({
        flow: flow || undefined,
        status: status || undefined,
      });

      setLeads(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch chatbot leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [flow, status]);

  const filteredLeads = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return leads;

    return leads.filter((lead) =>
      [
        lead.name,
        lead.phone,
        lead.email,
        lead.city,
        lead.occasion,
        lead.budget,
        lead.saree_type,
        lead.requirement_type,
        lead.message,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [leads, search]);

  const handleStatusChange = async (
    leadId: string,
    nextStatus: ChatbotLeadStatus
  ) => {
    try {
      const updated = await updateChatbotLeadStatus(leadId, nextStatus);

      setLeads((prev) =>
        prev.map((lead) => (lead.id === leadId ? updated : lead))
      );

      toast.success("Lead status updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const stats = useMemo(() => {
    return {
      total: leads.length,
      new: leads.filter((lead) => lead.status === "new").length,
      contacted: leads.filter((lead) => lead.status === "contacted").length,
      converted: leads.filter((lead) => lead.status === "converted").length,
    };
  }, [leads]);

  return (
    <div className="p-6 space-y-6 bg-[#FFF9F0] min-h-screen">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#800020]">
            <MessageCircle size={24} />
            <h1 className="text-2xl font-bold">Chatbot Leads</h1>
          </div>
          <p className="text-sm text-[#4a3828]/70 mt-1">
            Manage shop, video shopping, bulk enquiry and support leads.
          </p>
        </div>

        <button
          onClick={fetchLeads}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#800020] text-white font-semibold shadow border border-[#D4AF37]"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Leads" value={stats.total} />
        <StatCard title="New" value={stats.new} />
        <StatCard title="Contacted" value={stats.contacted} />
        <StatCard title="Converted" value={stats.converted} />
      </div>

      <div className="bg-white border border-[#EAD9C5] rounded-2xl p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a3828]/50"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, phone, budget, message..."
              className="w-full pl-10 pr-3 py-2.5 border border-[#EAD9C5] rounded-xl outline-none focus:ring-2 focus:ring-[#C4980A]/30"
            />
          </div>

          <div className="relative">
            <Filter
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a3828]/50"
            />
            <select
              value={flow}
              onChange={(e) => setFlow(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-[#EAD9C5] rounded-xl outline-none bg-white"
            >
              {FLOW_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2.5 border border-[#EAD9C5] rounded-xl outline-none bg-white"
          >
            <option value="">All Status</option>
            {STATUS_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white border border-[#EAD9C5] rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-[#4a3828]/70">
            Loading chatbot leads...
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-10 text-center text-[#4a3828]/70">
            No chatbot leads found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-sm">
              <thead className="bg-[#F5E6D3] text-[#4a3828]">
                <tr>
                  <th className="text-left p-4">Customer</th>
                  <th className="text-left p-4">Flow</th>
                  <th className="text-left p-4">Details</th>
                  <th className="text-left p-4">Message</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Created</th>
                  <th className="text-left p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-t border-[#EAD9C5] align-top hover:bg-[#FFF9F0]"
                  >
                    <td className="p-4">
                      <p className="font-bold text-[#800020]">{lead.name}</p>
                      <p className="text-[#4a3828]">{lead.phone}</p>

                      {lead.email && (
                        <p className="text-xs text-[#4a3828]/60">
                          {lead.email}
                        </p>
                      )}

                      {lead.city && (
                        <p className="text-xs text-[#4a3828]/60">
                          City: {lead.city}
                        </p>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="inline-flex px-3 py-1 rounded-full bg-[#800020]/10 text-[#800020] font-semibold">
                        {formatFlow(lead.flow)}
                      </span>
                    </td>

                    <td className="p-4 space-y-1 text-[#4a3828]">
                      {lead.saree_type && <p>Saree: {lead.saree_type}</p>}
                      {lead.occasion && <p>Occasion: {lead.occasion}</p>}
                      {lead.budget && <p>Budget: {lead.budget}</p>}

                      {lead.requirement_type && (
                        <p>Type: {lead.requirement_type}</p>
                      )}

                      {lead.approx_quantity && (
                        <p>Qty: {lead.approx_quantity}</p>
                      )}

                      {lead.preferred_date && (
                        <p className="flex items-center gap-1">
                          <Calendar size={14} />
                          {lead.preferred_date} {lead.preferred_time || ""}
                        </p>
                      )}
                    </td>

                    <td className="p-4 max-w-[280px]">
                      <p className="text-[#4a3828]/80 line-clamp-4">
                        {lead.message || "-"}
                      </p>
                    </td>

                    <td className="p-4">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          handleStatusChange(
                            lead.id,
                            e.target.value as ChatbotLeadStatus
                          )
                        }
                        className={`border rounded-xl px-3 py-2 font-semibold ${
                          statusClass[lead.status]
                        }`}
                      >
                        {STATUS_OPTIONS.map((item) => (
                          <option key={item} value={item}>
                            {item.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-4 text-[#4a3828]/70">
                      {formatDate(lead.created_at)}
                    </td>

                    <td className="p-4">
                      <a
                        href={whatsappLink(lead.phone, lead.name, lead.flow)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                      >
                        <Phone size={15} />
                        WhatsApp
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white border border-[#EAD9C5] rounded-2xl p-5 shadow-sm">
      <p className="text-sm text-[#4a3828]/60">{title}</p>
      <p className="text-3xl font-bold text-[#800020] mt-1">{value}</p>
    </div>
  );
}