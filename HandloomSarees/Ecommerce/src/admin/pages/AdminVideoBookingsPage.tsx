import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  Phone,
  XCircle,
  Video,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "../components/AdminLayout";
import { useAdminVideoBookings } from "../../hooks/useAdminVideoBookings";

// ─── Brand palette (matches all other pages) ─────────────────────────────────
const C = {
  maroon: '#800020',
  maroonDk: '#5a0016',
  gold: '#C4980A',
  goldV: '#D4AF37',
  cream: '#F5E6D3',
  creamLt: '#FFF9F0',
  creamMid: '#F8EEE2',
  warmGrey: '#4a3828',
  navy: '#1B2A6B',
};

const STATUS_OPTIONS = ["all", "pending", "confirmed", "completed", "cancelled"] as const;
type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; dot: string; text: string; bg: string; border: string }
> = {
  pending: {
    label: "Pending",
    dot: "#F59E0B",
    text: "#92400E",
    bg: "#FFFBEB",
    border: "#FDE68A",
  },
  confirmed: {
    label: "Confirmed",
    dot: "#3B82F6",
    text: "#1E40AF",
    bg: "#EFF6FF",
    border: "#BFDBFE",
  },
  completed: {
    label: "Completed",
    dot: "#10B981",
    text: "#065F46",
    bg: "#ECFDF5",
    border: "#A7F3D0",
  },
  cancelled: {
    label: "Cancelled",
    dot: "#EF4444",
    text: "#991B1B",
    bg: "#FEF2F2",
    border: "#FECACA",
  },
};

const STAT_CARDS = [
  { key: "total", filterKey: "all", label: "Total", color: "#6366F1", bg: "#EEF2FF", border: "#C7D2FE" },
  { key: "pending", filterKey: "pending", label: "Pending", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  { key: "confirmed", filterKey: "confirmed", label: "Confirmed", color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" },
  { key: "completed", filterKey: "completed", label: "Completed", color: "#059669", bg: "#ECFDF5", border: "#A7F3D0" },
  { key: "cancelled", filterKey: "cancelled", label: "Cancelled", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
] as const;

function formatDate(dateString?: string) {
  if (!dateString) return "—";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 12px",
        borderRadius: 100,
        fontSize: 11,
        fontWeight: 600,
        fontFamily: "'Josefin Sans', sans-serif",
        letterSpacing: "0.04em",
        background: cfg.bg,
        color: cfg.text,
        border: `1px solid ${cfg.border}`,
        textTransform: "capitalize",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

export default function AdminVideoBookingsPage() {
  // ✅ Scroll to top when this page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { bookings, loading, updatingId, updateStatus } = useAdminVideoBookings();
  const [filter, setFilter] = useState<(typeof STATUS_OPTIONS)[number]>("all");

  const filteredBookings = useMemo(() => {
    if (filter === "all") return bookings;
    return bookings.filter((b) => b.status === filter);
  }, [bookings, filter]);

  const stats = useMemo(() => ({
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  }), [bookings]);

  const handleStatusChange = async (bookingId: string, status: BookingStatus) => {
    try {
      await updateStatus(bookingId, status);
      toast.success(`Booking marked as ${status}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update booking status");
    }
  };

  return (
    <AdminLayout title="Video Bookings">
      <style>{`
        .vb-brand {
          font-family: 'Josefin Sans', sans-serif;
        }
        .vb-title {
          font-family: 'Cinzel', serif;
          font-weight: 400;
          letter-spacing: 0.04em;
          color: #800020;
        }
        @media (max-width: 640px) {
          .vb-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .vb-action-col {
            width: 100% !important;
          }
          .vb-booking-card {
            flex-direction: column !important;
          }
        }
      `}</style>
      <div className="vb-brand" style={{ minHeight: "100vh" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 20px 60px" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              marginBottom: 32,
              paddingTop: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  background: `linear-gradient(135deg, ${C.maroon}, ${C.navy})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 6px 18px rgba(128,0,32,0.25)",
                }}
              >
                <Video size={22} color="white" />
              </div>
              <div>
                <h1 className="vb-title" style={{ fontSize: "clamp(24px, 5vw, 28px)", margin: 0 }}>
                  Video Bookings
                </h1>
                <p style={{ fontSize: 13, color: C.warmGrey, margin: "4px 0 0", fontWeight: 300 }}>
                  Manage consultations and update statuses
                </p>
              </div>
            </div>

            {/* Filter dropdown */}
            <div style={{ position: "relative", minWidth: 140 }}>
              <SlidersHorizontal size={14} color={C.gold} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                style={{
                  appearance: "none",
                  padding: "9px 36px 9px 34px",
                  fontSize: 13,
                  fontWeight: 500,
                  fontFamily: "'Josefin Sans', sans-serif",
                  color: C.maroon,
                  background: "rgba(255,249,240,.97)",
                  border: `1px solid rgba(196,152,10,.35)`,
                  borderRadius: 100,
                  cursor: "pointer",
                  outline: "none",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} color={C.gold} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="vb-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
            {STAT_CARDS.map(({ key, filterKey, label, color, bg, border }) => (
              <div
                key={key}
                onClick={() => setFilter(filterKey as any)}
                style={{
                  background: "rgba(255,249,240,.97)",
                  backdropFilter: "blur(8px)",
                  border: `1px solid rgba(196,152,10,.22)`,
                  borderRadius: 20,
                  padding: "16px 20px",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(128,0,32,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: bg,
                    border: `1px solid ${border}`,
                    marginBottom: 12,
                  }}
                >
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "block" }} />
                </div>
                <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9a8070", fontWeight: 600, margin: "0 0 6px" }}>{label}</p>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: 28, fontWeight: 500, color: C.maroon, margin: 0, lineHeight: 1 }}>{stats[key]}</p>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: "rgba(196,152,10,.2)", marginBottom: 24 }} />

          {/* Bookings List */}
          {loading ? (
            <div style={{ background: "rgba(255,249,240,.97)", border: "1px solid rgba(196,152,10,.22)", borderRadius: 24, padding: "48px 24px", textAlign: "center", color: "#9a8070", fontSize: 14 }}>Loading video bookings…</div>
          ) : filteredBookings.length === 0 ? (
            <div style={{ background: "rgba(255,249,240,.97)", border: "1.5px dashed rgba(196,152,10,.4)", borderRadius: 24, padding: "64px 24px", textAlign: "center" }}>
              <Video size={36} color={C.gold} style={{ margin: "0 auto 16px", opacity: 0.5 }} />
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: 20, color: C.maroon, margin: "0 0 8px" }}>No bookings found</p>
              <p style={{ fontSize: 13, color: "#9a8070", margin: 0 }}>No entries match the current filter.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  style={{
                    background: "rgba(255,249,240,.97)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(196,152,10,.22)",
                    borderRadius: 24,
                    overflow: "hidden",
                    transition: "box-shadow 0.2s",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Top accent stripe */}
                  <div
                    style={{
                      height: 4,
                      background:
                        booking.status === "completed"
                          ? "linear-gradient(90deg, #10B981, #34D399)"
                          : booking.status === "confirmed"
                          ? "linear-gradient(90deg, #3B82F6, #60A5FA)"
                          : booking.status === "cancelled"
                          ? "linear-gradient(90deg, #EF4444, #F87171)"
                          : "linear-gradient(90deg, #F59E0B, #FCD34D)",
                    }}
                  />

                  <div className="vb-booking-card" style={{ display: "flex", gap: 24, padding: "24px", flexWrap: "wrap" }}>
                    {/* Left: Main Info */}
                    <div style={{ flex: 1, minWidth: 260 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 14,
                            background: `linear-gradient(135deg, rgba(196,152,10,.2), rgba(128,0,32,.1))`,
                            border: `1px solid rgba(196,152,10,.35)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: 16,
                            color: C.maroon,
                            fontFamily: "'Cinzel', serif",
                          }}
                        >
                          {booking.name?.slice(0, 2).toUpperCase() || "?"}
                        </div>
                        <div>
                          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 18, fontWeight: 500, color: C.maroon, margin: 0 }}>{booking.name}</p>
                          <p style={{ fontSize: 11, color: "#9a8070", margin: "2px 0 0", fontFamily: "monospace" }}>#{booking.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                        <div style={{ marginLeft: "auto" }}>
                          <StatusBadge status={booking.status as BookingStatus} />
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                        {[
                          { icon: <Mail size={13} />, label: "Email", value: booking.email },
                          { icon: <Phone size={13} />, label: "Phone", value: booking.phone },
                          { icon: <CalendarDays size={13} />, label: "Preferred date", value: formatDate(booking.preferred_date) },
                          { icon: <Clock3 size={13} />, label: "Occasion", value: booking.occasion || "—" },
                          { icon: null, label: "Budget", value: booking.budget_range || "—" },
                        ].map(({ icon, label, value }) => (
                          <div
                            key={label}
                            style={{
                              background: "rgba(255,249,240,.8)",
                              border: "1px solid rgba(196,152,10,.18)",
                              borderRadius: 16,
                              padding: "10px 14px",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 600, color: "#9a8070", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                              {icon && <span style={{ color: C.gold }}>{icon}</span>}
                              {label}
                            </div>
                            <p style={{ fontSize: 13, color: C.warmGrey, margin: 0, fontWeight: 500, wordBreak: "break-word" }}>{value || "—"}</p>
                          </div>
                        ))}
                      </div>

                      {booking.notes && (
                        <div style={{ marginTop: 14, background: "rgba(196,152,10,.08)", border: "1px solid rgba(196,152,10,.25)", borderRadius: 16, padding: "12px 16px" }}>
                          <p style={{ fontSize: 10, fontWeight: 600, color: C.gold, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Notes</p>
                          <p style={{ fontSize: 13, color: C.warmGrey, margin: 0, lineHeight: 1.6 }}>{booking.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Right: Actions */}
                    <div className="vb-action-col" style={{ width: 220, flexShrink: 0 }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: "#9a8070", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>Actions</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {booking.status === "pending" && (
                          <>
                            <ActionButton label="Confirm Booking" color="#2563EB" disabled={updatingId === booking.id} onClick={() => handleStatusChange(booking.id, "confirmed")} />
                            <ActionButton label="Mark Completed" color="#059669" disabled={updatingId === booking.id} onClick={() => handleStatusChange(booking.id, "completed")} outline />
                            <ActionButton label="Cancel Booking" color="#DC2626" disabled={updatingId === booking.id} onClick={() => handleStatusChange(booking.id, "cancelled")} outline />
                          </>
                        )}
                        {booking.status === "confirmed" && (
                          <>
                            <ActionButton label="Mark Completed" color="#059669" disabled={updatingId === booking.id} onClick={() => handleStatusChange(booking.id, "completed")} />
                            <ActionButton label="Reopen as Pending" color="#D97706" disabled={updatingId === booking.id} onClick={() => handleStatusChange(booking.id, "pending")} outline />
                            <ActionButton label="Cancel Booking" color="#DC2626" disabled={updatingId === booking.id} onClick={() => handleStatusChange(booking.id, "cancelled")} outline />
                          </>
                        )}
                        {booking.status === "completed" && (
                          <>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 14, background: "#ECFDF5", border: "1px solid #A7F3D0", fontSize: 13, fontWeight: 600, color: "#065F46" }}>
                              <CheckCircle2 size={15} /> Completed
                            </div>
                            <ActionButton label="Reopen as Confirmed" color="#2563EB" disabled={updatingId === booking.id} onClick={() => handleStatusChange(booking.id, "confirmed")} outline />
                            <ActionButton label="Reopen as Pending" color="#D97706" disabled={updatingId === booking.id} onClick={() => handleStatusChange(booking.id, "pending")} outline />
                            <ActionButton label="Cancel Booking" color="#DC2626" disabled={updatingId === booking.id} onClick={() => handleStatusChange(booking.id, "cancelled")} outline />
                          </>
                        )}
                        {booking.status === "cancelled" && (
                          <>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 14, background: "#FEF2F2", border: "1px solid #FECACA", fontSize: 13, fontWeight: 600, color: "#991B1B" }}>
                              <XCircle size={15} /> Cancelled
                            </div>
                            <ActionButton label="Reopen as Pending" color="#D97706" disabled={updatingId === booking.id} onClick={() => handleStatusChange(booking.id, "pending")} outline />
                            <ActionButton label="Confirm Booking" color="#2563EB" disabled={updatingId === booking.id} onClick={() => handleStatusChange(booking.id, "confirmed")} outline />
                            <ActionButton label="Mark Completed" color="#059669" disabled={updatingId === booking.id} onClick={() => handleStatusChange(booking.id, "completed")} outline />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function ActionButton({
  label,
  color,
  disabled,
  onClick,
  outline = false,
}: {
  label: string;
  color: string;
  disabled: boolean;
  onClick: () => void;
  outline?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "10px 14px",
        borderRadius: 100,
        fontSize: 12,
        fontWeight: 600,
        fontFamily: "'Josefin Sans', sans-serif",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        transition: "all 0.2s",
        border: outline ? `1.5px solid ${color}` : "none",
        background: outline ? "transparent" : color,
        color: outline ? color : "white",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {disabled ? "Updating…" : label}
    </button>
  );
}