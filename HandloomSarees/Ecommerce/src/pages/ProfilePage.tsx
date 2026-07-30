import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/client';
import { addressApi } from '@/api/address';
import type { Address } from '@/types/address';
import { authService } from '@/lib/auth';
import { User, MapPin, Package, LogOut, Video, Sparkles, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { useVideoBooking } from "@/hooks/useVideoBooking";

const C = {
  maroon: '#800020',
  gold: '#C4980A',
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Josefin+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.pf-root {
  font-family: 'Josefin Sans', sans-serif;
  background: linear-gradient(170deg, #FFF9F0 0%, #F8EEE2 45%, #F5E6D3 100%);
  min-height: 100vh;
  color: #1a1010;
  line-height: 1;
}
.pf-wrap {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 64px;
}
@media(max-width:900px){ .pf-wrap { padding: 0 24px; } }
@media(max-width:480px){ .pf-wrap { padding: 0 16px; } }

.ey {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 10px;
  letter-spacing: 0.30em;
  text-transform: uppercase;
  color: #C4980A;
}

.pf-page-top { padding-top: 140px; padding-bottom: 80px; }
@media(max-width:640px){ .pf-page-top { padding-top: 110px; padding-bottom: 60px; } }

@keyframes pfFadeUp  {from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes pfFadeIn  {from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}

.pf-fadein { animation: pfFadeIn .8s cubic-bezier(.4,0,.2,1) both; }
.pf-fadeup { animation: pfFadeUp .8s cubic-bezier(.4,0,.2,1) both; }
.pf-d1 { animation-delay: .1s; }
.pf-d2 { animation-delay: .2s; }

.pf-hero {
  background: rgba(255,249,240,.97);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(196,152,10,.25);
  border-radius: 28px;
  overflow: hidden;
  margin-bottom: 28px;
  box-shadow: 0 16px 60px rgba(0,0,0,.08);
}
.pf-hero-bar {
  background: linear-gradient(135deg, #800020 0%, #5a0016 55%, #4B0082 100%);
  padding: 28px 36px;
  position: relative;
  overflow: hidden;
}
.pf-hero-bar-eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.pf-hero-bar-name {
  font-family: 'Cinzel', serif;
  font-size: clamp(24px, 4vw, 36px);
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
}
.pf-hero-bar-email {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 13px;
  color: rgba(255,255,255,.75);
}

.pf-hero-body {
  padding: 22px 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
@media(max-width:600px){ .pf-hero-body { padding: 18px 22px; } }

.pf-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(196,152,10,.12);
  border: 1.5px solid rgba(196,152,10,.3);
  display: flex;
  align-items: center;
  justify-content: center;
}
.pf-stats-row { display: flex; gap: 0; }
.pf-stat-cell {
  padding: 8px 20px;
  text-align: center;
  border-right: 1px solid rgba(196,152,10,.2);
}
.pf-stat-cell:first-child { border-left: 1px solid rgba(196,152,10,.2); }
.pf-stat-n {
  font-family: 'Cinzel', serif;
  font-size: 22px;
  font-weight: 600;
  color: #800020;
  line-height: 1;
}
.pf-stat-l {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 10px;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: #9a8070;
  margin-top: 3px;
  font-weight: 500;
}

.pf-logout {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: 100px;
  border: 1.5px solid rgba(200,50,50,.3);
  background: transparent;
  color: #c0392b;
  font-family: 'Josefin Sans', sans-serif;
  font-size: 12px;
  letter-spacing: .1em;
  text-transform: uppercase;
  font-weight: 600;
  cursor: pointer;
  transition: background .25s, color .25s;
}
.pf-logout:hover { background: #c0392b; color: white; }

.pf-card {
  background: rgba(255,249,240,.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(196,152,10,.22);
  border-radius: 24px;
  padding: 30px 32px;
  box-shadow: 0 8px 36px rgba(0,0,0,.06);
  margin-bottom: 24px;
}
@media(max-width:600px){ .pf-card { padding: 22px 18px; border-radius: 18px; } }

.pf-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 18px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(196,152,10,.18);
}
.pf-card-head-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.pf-card-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(196,152,10,.1);
  border: 1px solid rgba(196,152,10,.3);
  display: flex;
  align-items: center;
  justify-content: center;
}
.pf-card-title {
  font-family: 'Cinzel', serif;
  font-size: 20px;
  font-weight: 600;
  color: #800020;
}

.pf-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
@media(max-width: 900px){ .pf-grid { grid-template-columns: 1fr; } }

.pf-row {
  background: rgba(255,249,240,.7);
  border: 1px solid rgba(196,152,10,.2);
  border-radius: 16px;
  padding: 16px 18px;
  margin-bottom: 12px;
}
.pf-row-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.pf-row-name {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #800020;
}
.pf-row-sub {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 12px;
  color: #6b5344;
  margin-top: 4px;
}
.pf-address-phone {
  font-size: 12px;
  color: #800020;
  margin-top: 2px;
}
.pf-address-line {
  font-size: 13px;
  color: #5a483a;
  margin-top: 4px;
  line-height: 1.3;
}
.pf-tag {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 100px;
  background: rgba(196,152,10,.12);
  border: 1px solid rgba(196,152,10,.3);
  color: #C4980A;
}

.pf-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 100px;
  background: #800020;
  color: white;
  border: none;
  font-family: 'Josefin Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.pf-form {
  background: rgba(255,255,255,.9);
  border: 1px solid rgba(196,152,10,.3);
  border-radius: 18px;
  padding: 20px;
  margin-bottom: 20px;
}
.pf-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
@media(max-width:480px){ .pf-form-grid { grid-template-columns: 1fr; } }
.pf-field-full { grid-column: 1 / -1; }

.pf-label {
  font-size: 11px;
  font-weight: 600;
  color: #5a483a;
  display: block;
  margin-bottom: 4px;
}
.pf-input {
  width: 100%;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid rgba(196,152,10,.3);
  font-family: 'Josefin Sans', sans-serif;
  font-size: 13px;
  outline: none;
}
.pf-input:focus { border-color: #800020; }

.pf-form-actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}
.pf-save-btn {
  background: #800020;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.pf-cancel-btn {
  background: transparent;
  color: #6b5344;
  border: 1px solid rgba(196,152,10,.3);
  padding: 10px 20px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.pf-remove-address-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 100px;
  border: 1px solid rgba(200,50,50,.25);
  background: transparent;
  color: #c0392b;
  font-family: 'Josefin Sans', sans-serif;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}

.pf-empty {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 13px;
  color: #7a6555;
  text-align: center;
  padding: 16px 0;
}
`;

type AddressFormState = {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
};

type UserOrder = {
  id: string;
  order_number?: string;
  total_amount?: number;
  total?: number;
  finalTotal?: number;
  payment_status?: string;
  order_status?: string;
  status?: string;
  created_at?: string;
  items?: Array<{
    id?: string;
    quantity?: number;
  }>;
};

const initialForm: AddressFormState = {
  name: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
};

export function ProfilePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const [user, setUser] = useState(currentUser);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [addressesError, setAddressesError] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<AddressFormState>(initialForm);

  const { bookings, loading: bookingsLoading } = useVideoBooking();

  useEffect(() => {
    const refreshedUser = authService.getCurrentUser();
    setUser(refreshedUser);
  }, []);

  const fetchAddresses = async () => {
    try {
      setAddressesLoading(true);
      setAddressesError('');
      const data = await addressApi.getAddresses();
      setAddresses(data || []);
    } catch (err: any) {
      console.error('Failed to fetch addresses:', err);
      setAddressesError(err?.response?.data?.message || err?.message || 'Failed to load addresses');
    } finally {
      setAddressesLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchAddresses();
    }
  }, [user?.id]);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setOrdersLoading(true);
        setOrdersError('');

        const res = await api.get('/orders/user');

        let items: UserOrder[] = [];

        if (Array.isArray(res.data)) {
          items = res.data;
        } else if (Array.isArray(res.data?.data)) {
          items = res.data.data;
        } else if (Array.isArray(res.data?.data?.items)) {
          items = res.data.data.items;
        } else if (Array.isArray(res.data?.orders)) {
          items = res.data.orders;
        } else if (Array.isArray(res.data?.items)) {
          items = res.data.items;
        }

        const realOrders = items.filter((order) => {
          const payment = (order.payment_status || '').toLowerCase();
          const status = (order.order_status || order.status || '').toLowerCase();
          return payment === 'paid' || status === 'confirmed';
        });

        setOrders(realOrders);
      } catch (err: any) {
        console.error('Failed to fetch user orders:', err);
        setOrdersError(err?.message || 'Failed to load orders');
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    if (user?.id) {
      fetchUserOrders();
    }
  }, [user?.id]);

  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  const handleInputChange = (field: keyof AddressFormState, value: string) => {
    setAddressForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditClick = (addr: Address) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      name: addr.full_name,
      phone: addr.phone,
      addressLine1: addr.line1,
      addressLine2: addr.line2 || '',
      city: addr.city,
      state: addr.state,
      pincode: addr.postal_code,
    });
    setShowAddressForm(true);
  };

  const handleSaveAddress = async () => {
    if (
      !addressForm.name.trim() ||
      !addressForm.phone.trim() ||
      !addressForm.addressLine1.trim() ||
      !addressForm.city.trim() ||
      !addressForm.state.trim() ||
      !addressForm.pincode.trim()
    ) {
      toast.error('Please fill all required address fields');
      return;
    }

    try {
      const payload = {
        full_name: addressForm.name.trim(),
        phone: addressForm.phone.trim(),
        line1: addressForm.addressLine1.trim(),
        line2: addressForm.addressLine2.trim() || undefined,
        city: addressForm.city.trim(),
        state: addressForm.state.trim(),
        postal_code: addressForm.pincode.trim(),
        country: 'India',
      };

      if (editingAddressId) {
        await addressApi.updateAddress(editingAddressId, payload);
        toast.success('Address updated successfully');
      } else {
        await addressApi.createAddress(payload);
        toast.success('Address added successfully');
      }

      setAddressForm(initialForm);
      setEditingAddressId(null);
      setShowAddressForm(false);
      await fetchAddresses();
    } catch (err: any) {
      console.error('Failed to save address:', err);
      toast.error(err?.response?.data?.message || 'Failed to save address');
    }
  };

  const handleRemoveAddress = async (addressId: string) => {
    try {
      await addressApi.deleteAddress(addressId);
      toast.success('Address removed successfully');
      await fetchAddresses();
    } catch (err: any) {
      console.error('Failed to delete address:', err);
      toast.error(err?.response?.data?.message || 'Failed to delete address');
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      await addressApi.setDefaultAddress(addressId);
      toast.success('Default address set');
      await fetchAddresses();
    } catch (err: any) {
      console.error('Failed to set default address:', err);
      toast.error(err?.response?.data?.message || 'Failed to set default address');
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="pf-root">
        <div className="pf-wrap pf-page-top">
          <div className="pf-hero pf-fadein">
            <div className="pf-hero-bar">
              <div className="pf-hero-bar-eyebrow">
                <Sparkles size={13} color="rgba(212,175,55,.75)" />
                <span className="ey">Member Profile</span>
              </div>
              <div className="pf-hero-bar-name">{user.name}</div>
              <div className="pf-hero-bar-email">{user.email}</div>
              {user.phone && (
                <div className="pf-hero-bar-email" style={{ marginTop: 2 }}>{user.phone}</div>
              )}
            </div>

            <div className="pf-hero-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div className="pf-avatar">
                  <User size={24} color={C.gold} />
                </div>
                <div className="pf-stats-row">
                  {[
                    [String(orders.length), 'Orders'],
                    [String(bookings.length), 'Sessions'],
                    [String(addresses.length), 'Addresses'],
                  ].map(([n, l]) => (
                    <div key={l} className="pf-stat-cell">
                      <div className="pf-stat-n">{n}</div>
                      <div className="pf-stat-l">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <button className="pf-logout" onClick={handleLogout}>
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>

          <div className="pf-consult-section pf-fadeup pf-d1">
            <div className="pf-card">
              <div className="pf-card-head">
                <div className="pf-card-head-left">
                  <div className="pf-card-icon"><Video size={16} color={C.gold} /></div>
                  <h2 className="pf-card-title">Video Consultations</h2>
                </div>
              </div>

              {bookingsLoading ? (
                <p className="pf-empty">Loading consultations...</p>
              ) : bookings.length > 0 ? (
                bookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="pf-row">
                    <div className="pf-row-head">
                      <div>
                        <div className="pf-row-name">{booking.occasion || 'General Consultation'}</div>
                        <div className="pf-row-sub">
                          {new Date(booking.preferred_date).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </div>
                        {booking.notes && (
                          <div className="pf-row-sub" style={{ marginTop: 6 }}>
                            {booking.notes}
                          </div>
                        )}
                      </div>
                      <span className="pf-tag">{booking.status || 'pending'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="pf-empty">No consultations yet</p>
              )}
            </div>
          </div>

          <div className="pf-grid pf-fadeup pf-d2">
            <div className="pf-card">
              <div className="pf-card-head">
                <div className="pf-card-head-left">
                  <div className="pf-card-icon"><MapPin size={16} color={C.gold} /></div>
                  <h2 className="pf-card-title">Saved Addresses</h2>
                </div>

                <button
                  className="pf-add-btn"
                  onClick={() => {
                    setEditingAddressId(null);
                    setAddressForm(initialForm);
                    setShowAddressForm(true);
                  }}
                  type="button"
                >
                  <Plus size={14} /> Add Address
                </button>
              </div>

              {showAddressForm && (
                <div className="pf-form">
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: C.maroon }}>
                    {editingAddressId ? 'Edit Address' : 'New Address'}
                  </h3>
                  <div className="pf-form-grid">
                    <div>
                      <label className="pf-label">Full Name *</label>
                      <input
                        className="pf-input"
                        value={addressForm.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter full name"
                      />
                    </div>

                    <div>
                      <label className="pf-label">Phone *</label>
                      <input
                        className="pf-input"
                        value={addressForm.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div className="pf-field-full">
                      <label className="pf-label">Address Line 1 *</label>
                      <input
                        className="pf-input"
                        value={addressForm.addressLine1}
                        onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                        placeholder="House no, street, area"
                      />
                    </div>

                    <div className="pf-field-full">
                      <label className="pf-label">Address Line 2</label>
                      <input
                        className="pf-input"
                        value={addressForm.addressLine2}
                        onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                        placeholder="Landmark, optional"
                      />
                    </div>

                    <div>
                      <label className="pf-label">City *</label>
                      <input
                        className="pf-input"
                        value={addressForm.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Enter city"
                      />
                    </div>

                    <div>
                      <label className="pf-label">State *</label>
                      <input
                        className="pf-input"
                        value={addressForm.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="Enter state"
                      />
                    </div>

                    <div>
                      <label className="pf-label">Pincode *</label>
                      <input
                        className="pf-input"
                        value={addressForm.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        placeholder="Enter pincode"
                      />
                    </div>
                  </div>

                  <div className="pf-form-actions">
                    <button type="button" className="pf-save-btn" onClick={handleSaveAddress}>
                      {editingAddressId ? 'Update Address' : 'Save Address'}
                    </button>
                    <button
                      type="button"
                      className="pf-cancel-btn"
                      onClick={() => {
                        setShowAddressForm(false);
                        setEditingAddressId(null);
                        setAddressForm(initialForm);
                      }}
                    >
                      <X size={14} style={{ marginRight: 6 }} />
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {addressesLoading ? (
                <p className="pf-empty">Loading addresses...</p>
              ) : addressesError ? (
                <div style={{ padding: '12px 0' }}>
                  <p className="pf-empty" style={{ color: '#c0392b' }}>{addressesError}</p>
                  <button type="button" className="pf-add-btn" onClick={fetchAddresses} style={{ marginTop: 8 }}>
                    Retry
                  </button>
                </div>
              ) : addresses && addresses.length > 0 ? (
                addresses.map((addr) => (
                  <div key={addr.id} className="pf-row">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div className="pf-row-name">{addr.full_name}</div>
                        <div className="pf-address-phone">{addr.phone}</div>
                      </div>
                      {addr.is_default && (
                        <span className="pf-tag" style={{ background: 'rgba(128,0,32,.1)', borderColor: '#800020' }}>
                          Default
                        </span>
                      )}
                    </div>
                    <div className="pf-address-line">
                      {addr.line1}
                      {addr.line2 && `, ${addr.line2}`}
                    </div>
                    <div className="pf-address-line">
                      {addr.city}, {addr.state} – {addr.postal_code}
                    </div>

                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
                      {!addr.is_default && (
                        <button
                          type="button"
                          className="pf-remove-address-btn"
                          style={{ color: '#800020', borderColor: 'rgba(128,0,32,.25)' }}
                          onClick={() => handleSetDefaultAddress(addr.id)}
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        type="button"
                        className="pf-remove-address-btn"
                        style={{ color: '#4a3828', borderColor: 'rgba(74,56,40,.25)' }}
                        onClick={() => handleEditClick(addr)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="pf-remove-address-btn"
                        onClick={() => handleRemoveAddress(addr.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="pf-empty">No saved addresses. Add a delivery address to speed up checkout.</p>
              )}
            </div>

            <div className="pf-card">
              <div className="pf-card-head">
                <div className="pf-card-head-left">
                  <div className="pf-card-icon"><Package size={16} color={C.gold} /></div>
                  <h2 className="pf-card-title">Recent Orders</h2>
                </div>
              </div>

              {ordersLoading ? (
                <p className="pf-empty">Loading orders...</p>
              ) : ordersError ? (
                <p className="pf-empty" style={{ color: '#c0392b' }}>{ordersError}</p>
              ) : orders.length > 0 ? (
                orders.slice(0, 3).map((o: UserOrder) => {
                  const itemCount =
                    o.items?.reduce((sum, item) => sum + Number(item.quantity ?? 0), 0) ||
                    o.items?.length ||
                    0;

                  const amount = o.total_amount ?? o.total ?? o.finalTotal ?? 0;
                  const status = o.order_status || o.status || 'confirmed';

                  return (
                    <div key={o.id} className="pf-row">
                      <div className="pf-row-head">
                        <div>
                          <div className="pf-row-name" style={{ fontSize: 15 }}>
                            {o.order_number || `Order #${o.id.slice(-8)}`}
                          </div>
                          <div className="pf-row-sub">
                            {itemCount} item{itemCount !== 1 ? 's' : ''} · ₹{Number(amount).toLocaleString('en-IN')}
                          </div>
                        </div>
                        <span className="pf-tag">{status}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="pf-empty">No orders yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}