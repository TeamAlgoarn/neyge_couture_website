// import { useMemo, useState } from 'react';
// import { toast } from 'sonner';
// import { useAdminVideoBookings } from '@/hooks/useAdminVideoBookings';

// const STATUS_OPTIONS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const;

// export default function AdminVideoBookingsPage() {
//   const { bookings, loading, updatingId, updateStatus } = useAdminVideoBookings();
//   const [filter, setFilter] = useState<(typeof STATUS_OPTIONS)[number]>('all');

//   const filteredBookings = useMemo(() => {
//     if (filter === 'all') return bookings;
//     return bookings.filter((booking) => booking.status === filter);
//   }, [bookings, filter]);

//   const handleStatusChange = async (
//     bookingId: string,
//     status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
//   ) => {
//     try {
//       await updateStatus(bookingId, status);
//       toast.success(`Booking marked as ${status}`);
//     } catch (error: any) {
//       toast.error(error?.response?.data?.message || 'Failed to update booking status');
//     }
//   };

//   return (
//     <div style={{ padding: '24px' }}>
//       <div
//         style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           marginBottom: '24px',
//           gap: '16px',
//           flexWrap: 'wrap',
//         }}
//       >
//         <div>
//           <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '6px' }}>
//             Video Bookings
//           </h1>
//           <p style={{ color: '#666' }}>Manage all consultation bookings</p>
//         </div>

//         <select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value as (typeof STATUS_OPTIONS)[number])}
//           style={{
//             padding: '10px 14px',
//             borderRadius: '10px',
//             border: '1px solid #ddd',
//             minWidth: '180px',
//           }}
//         >
//           {STATUS_OPTIONS.map((status) => (
//             <option key={status} value={status}>
//               {status.toUpperCase()}
//             </option>
//           ))}
//         </select>
//       </div>

//       {loading ? (
//         <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '14px' }}>
//           Loading bookings...
//         </div>
//       ) : filteredBookings.length === 0 ? (
//         <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '14px' }}>
//           No video bookings found.
//         </div>
//       ) : (
//         <div style={{ display: 'grid', gap: '16px' }}>
//           {filteredBookings.map((booking) => (
//             <div
//               key={booking.id}
//               style={{
//                 border: '1px solid #e5e5e5',
//                 borderRadius: '18px',
//                 padding: '20px',
//                 background: '#fff',
//               }}
//             >
//               <div
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   gap: '20px',
//                   flexWrap: 'wrap',
//                 }}
//               >
//                 <div style={{ flex: 1, minWidth: '280px' }}>
//                   <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '10px' }}>
//                     {booking.name}
//                   </h2>

//                   <p style={{ marginBottom: '6px' }}><strong>Email:</strong> {booking.email}</p>
//                   <p style={{ marginBottom: '6px' }}><strong>Phone:</strong> {booking.phone}</p>
//                   <p style={{ marginBottom: '6px' }}>
//                     <strong>Occasion:</strong> {booking.occasion || '-'}
//                   </p>
//                   <p style={{ marginBottom: '6px' }}>
//                     <strong>Budget:</strong> {booking.budget_range || '-'}
//                   </p>
//                   <p style={{ marginBottom: '6px' }}>
//                     <strong>Preferred Date:</strong>{' '}
//                     {new Date(booking.preferred_date).toLocaleString()}
//                   </p>
//                   <p style={{ marginBottom: '6px' }}>
//                     <strong>Status:</strong> {booking.status}
//                   </p>

//                   {booking.notes ? (
//                     <p style={{ marginTop: '10px', color: '#555' }}>
//                       <strong>Notes:</strong> {booking.notes}
//                     </p>
//                   ) : null}
//                 </div>

//                 <div style={{ minWidth: '220px', display: 'grid', gap: '10px' }}>
//                   <button
//                     onClick={() => handleStatusChange(booking.id, 'confirmed')}
//                     disabled={updatingId === booking.id}
//                     style={{
//                       padding: '10px 14px',
//                       borderRadius: '10px',
//                       border: 'none',
//                       background: '#2563eb',
//                       color: '#fff',
//                       cursor: 'pointer',
//                       opacity: updatingId === booking.id ? 0.6 : 1,
//                     }}
//                   >
//                     Confirm
//                   </button>

//                   <button
//                     onClick={() => handleStatusChange(booking.id, 'completed')}
//                     disabled={updatingId === booking.id}
//                     style={{
//                       padding: '10px 14px',
//                       borderRadius: '10px',
//                       border: 'none',
//                       background: '#16a34a',
//                       color: '#fff',
//                       cursor: 'pointer',
//                       opacity: updatingId === booking.id ? 0.6 : 1,
//                     }}
//                   >
//                     Complete
//                   </button>

//                   <button
//                     onClick={() => handleStatusChange(booking.id, 'cancelled')}
//                     disabled={updatingId === booking.id}
//                     style={{
//                       padding: '10px 14px',
//                       borderRadius: '10px',
//                       border: 'none',
//                       background: '#dc2626',
//                       color: '#fff',
//                       cursor: 'pointer',
//                       opacity: updatingId === booking.id ? 0.6 : 1,
//                     }}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



import { useMemo, useState } from "react";
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
  if (Number.isNaN(d.getTime())) return "—";
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
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.04em",
        background: cfg.bg,
        color: cfg.text,
        border: `1px solid ${cfg.border}`,
        textTransform: "capitalize",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: cfg.dot,
          flexShrink: 0,
        }}
      />
      {cfg.label}
    </span>
  );
}

export default function AdminVideoBookingsPage() {
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
      <div style={{ minHeight: "100vh", background: "#F8F9FB", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 60px" }}>

          {/* ── Header ── */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 32,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
                  flexShrink: 0,
                }}
              >
                <Video size={20} color="white" />
              </div>
              <div>
                <h1
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#0F172A",
                    margin: 0,
                    letterSpacing: "-0.3px",
                  }}
                >
                  Video Booking Management
                </h1>
                <p style={{ fontSize: 13, color: "#64748B", margin: "3px 0 0", fontWeight: 400 }}>
                  Review consultations, update statuses &amp; manage appointments
                </p>
              </div>
            </div>

            {/* Filter */}
            <div style={{ position: "relative" }}>
              <SlidersHorizontal
                size={14}
                color="#94A3B8"
                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as (typeof STATUS_OPTIONS)[number])}
                style={{
                  appearance: "none",
                  paddingLeft: 34,
                  paddingRight: 36,
                  paddingTop: 9,
                  paddingBottom: 9,
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#334155",
                  background: "white",
                  border: "1px solid #E2E8F0",
                  borderRadius: 10,
                  cursor: "pointer",
                  outline: "none",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                color="#94A3B8"
                style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
              />
            </div>
          </div>

          {/* ── Stat Cards ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 14,
              marginBottom: 28,
            }}
          >
            {STAT_CARDS.map(({ key, filterKey, label, color, bg, border }) => (
              <div
                key={key}
                style={{
                  background: "white",
                  border: "1px solid #E2E8F0",
                  borderRadius: 14,
                  padding: "16px 20px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  cursor: "pointer",
                  transition: "box-shadow 0.2s",
                }}
                onClick={() => setFilter(filterKey as any)}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: bg,
                    border: `1px solid ${border}`,
                    marginBottom: 10,
                  }}
                >
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "block" }} />
                </div>
                <p style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {label}
                </p>
                <p style={{ fontSize: 28, fontWeight: 700, color: "#0F172A", margin: 0, lineHeight: 1 }}>
                  {stats[key]}
                </p>
              </div>
            ))}
          </div>

          {/* ── Divider ── */}
          <div style={{ height: 1, background: "#E2E8F0", marginBottom: 24 }} />

          {/* ── Content ── */}
          {loading ? (
            <div
              style={{
                background: "white",
                border: "1px solid #E2E8F0",
                borderRadius: 16,
                padding: "48px 24px",
                textAlign: "center",
                color: "#94A3B8",
                fontSize: 14,
              }}
            >
              Loading video bookings…
            </div>
          ) : filteredBookings.length === 0 ? (
            <div
              style={{
                background: "white",
                border: "1.5px dashed #CBD5E1",
                borderRadius: 16,
                padding: "64px 24px",
                textAlign: "center",
              }}
            >
              <Video size={36} color="#CBD5E1" style={{ margin: "0 auto 14px" }} />
              <p style={{ fontSize: 15, fontWeight: 600, color: "#334155", margin: "0 0 6px" }}>
                No bookings found
              </p>
              <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>
                No entries match the current filter.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  style={{
                    background: "white",
                    border: "1px solid #E2E8F0",
                    borderRadius: 18,
                    overflow: "hidden",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    transition: "box-shadow 0.2s",
                  }}
                >
                  {/* Card top stripe */}
                  <div
                    style={{
                      height: 3,
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

                  <div
                    style={{
                      padding: "20px 24px",
                      display: "flex",
                      gap: 24,
                      flexWrap: "wrap",
                      alignItems: "flex-start",
                    }}
                  >
                    {/* Left: main info */}
                    <div style={{ flex: 1, minWidth: 260 }}>
                      {/* Name + status */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          marginBottom: 16,
                          flexWrap: "wrap",
                        }}
                      >
                        {/* Avatar */}
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: "#EEF2FF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: 14,
                            color: "#4F46E5",
                            flexShrink: 0,
                          }}
                        >
                          {booking.name?.slice(0, 2).toUpperCase() || "?"}
                        </div>
                        <div>
                          <p style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 }}>
                            {booking.name}
                          </p>
                          <p style={{ fontSize: 11, color: "#94A3B8", margin: 0, fontFamily: "'SF Mono', monospace" }}>
                            #{booking.id.slice(0, 8).toUpperCase()}
                          </p>
                        </div>
                        <div style={{ marginLeft: "auto" }}>
                          <StatusBadge status={booking.status as BookingStatus} />
                        </div>
                      </div>

                      {/* Detail grid */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
                          gap: 10,
                        }}
                      >
                        {[
                          { icon: <Mail size={13} />, label: "Email", value: booking.email },
                          { icon: <Phone size={13} />, label: "Phone", value: booking.phone },
                          {
                            icon: <CalendarDays size={13} />,
                            label: "Preferred date",
                            value: formatDate(booking.preferred_date),
                          },
                          {
                            icon: <Clock3 size={13} />,
                            label: "Occasion",
                            value: booking.occasion || "—",
                          },
                          { icon: null, label: "Budget", value: booking.budget_range || "—" },
                        ].map(({ icon, label, value }) => (
                          <div
                            key={label}
                            style={{
                              background: "#F8F9FB",
                              border: "1px solid #F1F5F9",
                              borderRadius: 10,
                              padding: "10px 12px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 5,
                                fontSize: 11,
                                fontWeight: 600,
                                color: "#94A3B8",
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                marginBottom: 5,
                              }}
                            >
                              {icon && <span style={{ color: "#64748B" }}>{icon}</span>}
                              {label}
                            </div>
                            <p
                              style={{
                                fontSize: 13,
                                color: "#334155",
                                margin: 0,
                                fontWeight: 500,
                                wordBreak: "break-word",
                              }}
                            >
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Notes */}
                      {booking.notes && (
                        <div
                          style={{
                            marginTop: 12,
                            background: "#FFFBEB",
                            border: "1px solid #FDE68A",
                            borderRadius: 10,
                            padding: "10px 14px",
                          }}
                        >
                          <p
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: "#92400E",
                              margin: "0 0 4px",
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                            }}
                          >
                            Notes
                          </p>
                          <p style={{ fontSize: 13, color: "#78350F", margin: 0, lineHeight: 1.6 }}>
                            {booking.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right: Actions */}
                    <div
                      style={{
                        width: 200,
                        flexShrink: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#94A3B8",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          margin: "0 0 4px",
                        }}
                      >
                        Actions
                      </p>

                      {/* Pending → Confirm, Complete, Cancel */}
                      {booking.status === "pending" && (
                        <>
                          <ActionButton
                            label="Confirm Booking"
                            color="#2563EB"
                            disabled={updatingId === booking.id}
                            onClick={() => handleStatusChange(booking.id, "confirmed")}
                          />
                          <ActionButton
                            label="Mark Completed"
                            color="#059669"
                            disabled={updatingId === booking.id}
                            onClick={() => handleStatusChange(booking.id, "completed")}
                            outline
                          />
                          <ActionButton
                            label="Cancel Booking"
                            color="#DC2626"
                            disabled={updatingId === booking.id}
                            onClick={() => handleStatusChange(booking.id, "cancelled")}
                            outline
                          />
                        </>
                      )}

                      {/* Confirmed → Complete, Reopen Pending, Cancel */}
                      {booking.status === "confirmed" && (
                        <>
                          <ActionButton
                            label="Mark Completed"
                            color="#059669"
                            disabled={updatingId === booking.id}
                            onClick={() => handleStatusChange(booking.id, "completed")}
                          />
                          <ActionButton
                            label="Reopen as Pending"
                            color="#D97706"
                            disabled={updatingId === booking.id}
                            onClick={() => handleStatusChange(booking.id, "pending")}
                            outline
                          />
                          <ActionButton
                            label="Cancel Booking"
                            color="#DC2626"
                            disabled={updatingId === booking.id}
                            onClick={() => handleStatusChange(booking.id, "cancelled")}
                            outline
                          />
                        </>
                      )}

                      {/* Completed → status badge + Reopen Confirmed, Reopen Pending, Cancel */}
                      {booking.status === "completed" && (
                        <>
                          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 14px", borderRadius: 10, background: "#ECFDF5", border: "1px solid #A7F3D0", fontSize: 13, fontWeight: 600, color: "#065F46" }}>
                            <CheckCircle2 size={15} />
                            Completed
                          </div>
                          <ActionButton
                            label="Reopen as Confirmed"
                            color="#2563EB"
                            disabled={updatingId === booking.id}
                            onClick={() => handleStatusChange(booking.id, "confirmed")}
                            outline
                          />
                          <ActionButton
                            label="Reopen as Pending"
                            color="#D97706"
                            disabled={updatingId === booking.id}
                            onClick={() => handleStatusChange(booking.id, "pending")}
                            outline
                          />
                          <ActionButton
                            label="Cancel Booking"
                            color="#DC2626"
                            disabled={updatingId === booking.id}
                            onClick={() => handleStatusChange(booking.id, "cancelled")}
                            outline
                          />
                        </>
                      )}

                      {/* Cancelled → status badge + Reopen Pending, Confirm, Mark Completed */}
                      {booking.status === "cancelled" && (
                        <>
                          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 14px", borderRadius: 10, background: "#FEF2F2", border: "1px solid #FECACA", fontSize: 13, fontWeight: 600, color: "#991B1B" }}>
                            <XCircle size={15} />
                            Cancelled
                          </div>
                          <ActionButton
                            label="Reopen as Pending"
                            color="#D97706"
                            disabled={updatingId === booking.id}
                            onClick={() => handleStatusChange(booking.id, "pending")}
                            outline
                          />
                          <ActionButton
                            label="Confirm Booking"
                            color="#2563EB"
                            disabled={updatingId === booking.id}
                            onClick={() => handleStatusChange(booking.id, "confirmed")}
                            outline
                          />
                          <ActionButton
                            label="Mark Completed"
                            color="#059669"
                            disabled={updatingId === booking.id}
                            onClick={() => handleStatusChange(booking.id, "completed")}
                            outline
                          />
                        </>
                      )}
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
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        transition: "opacity 0.15s, background 0.15s",
        border: outline ? `1.5px solid ${color}` : "none",
        background: outline ? "transparent" : color,
        color: outline ? color : "white",
        letterSpacing: "0.01em",
      }}
    >
      {disabled ? "Updating…" : label}
    </button>
  );
}
