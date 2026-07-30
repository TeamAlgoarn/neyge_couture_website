import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCarts';
import { authService } from '@/lib/auth';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import api from '@/api/client';
import { addressApi } from '@/api/address';
import type { Address } from '@/types/address';
import { CreditCard, Smartphone, Wallet, Sparkles, MapPin, Plus } from 'lucide-react';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

const C = {
  maroon: '#800020',
  maroonDk: '#5a0016',
  gold: '#C4980A',
  goldV: '#D4AF37',
  cream: '#F5E6D3',
  creamLt: '#FFF9F0',
  warmGrey: '#4a3828',
  indigo: '#4B0082',
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Josefin+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.co-root {
  font-family: 'Josefin Sans', sans-serif;
  background: linear-gradient(170deg, #FFF9F0 0%, #F8EEE2 50%, #F5E6D3 100%);
  min-height: 100vh;
  color: #1a1010;
  line-height: 1;
}
.co-wrap {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 56px;
}
@media(max-width:900px){ .co-wrap { padding: 0 24px; } }
@media(max-width:480px){ .co-wrap { padding: 0 16px; } }

.co-ey {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 11px;
  letter-spacing: .25em;
  text-transform: uppercase;
  color: #C4980A;
  font-weight: 600;
}

/* PAGE TOP */
.co-page-top { padding-top: 140px; padding-bottom: 80px; }
@media(max-width:640px){ .co-page-top { padding-top: 110px; padding-bottom: 60px; } }

/* ANIMATIONS */
@keyframes coFadeUp  {from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes coFadeIn  {from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
@keyframes coSpin    {to{transform:rotate(360deg)}}

.co-fadein { animation: coFadeIn .8s cubic-bezier(.4,0,.2,1) both; }
.co-fadeup { animation: coFadeUp .8s cubic-bezier(.4,0,.2,1) both; }
.co-d1 { animation-delay: .1s; }
.co-d2 { animation-delay: .2s; }

/* HERO */
.co-hero {
  text-align: center;
  margin-bottom: 40px;
}
.co-hero-title {
  font-family: 'Cinzel', serif;
  font-size: clamp(32px, 5vw, 48px);
  color: #800020;
  font-weight: 600;
  margin-bottom: 8px;
}
.co-hero-sub {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 14px;
  color: #6b5344;
  letter-spacing: .05em;
}

/* LAYOUT GRID */
.co-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 32px;
  align-items: start;
}
@media(max-width: 1024px){ .co-grid { grid-template-columns: 1fr; } }

/* CARDS */
.co-card {
  background: rgba(255, 249, 240, .95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(196,152,10,.25);
  border-radius: 24px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0,0,0,.05);
}
@media(max-width:600px){ .co-card { padding: 20px; border-radius: 18px; } }

.co-card-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 20px;
  margin-bottom: 24px;
  border-bottom: 1px solid rgba(196,152,10,.2);
}
.co-card-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #800020, #4B0082);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(128,0,32,.25);
}
.co-card-title {
  font-family: 'Cinzel', serif;
  font-size: 20px;
  color: #800020;
  font-weight: 600;
}

/* ADDRESS OPTIONS */
.co-address-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.co-address-option {
  position: relative;
  background: rgba(255,255,255,.6);
  border: 1.5px solid rgba(196,152,10,.25);
  border-radius: 16px;
  padding: 16px 20px;
  cursor: pointer;
  transition: all .25s ease;
}
.co-address-option:hover {
  border-color: rgba(196,152,10,.6);
  background: rgba(255,255,255,.9);
}
.co-address-option.selected {
  border-color: #800020;
  background: rgba(255, 249, 240, 1);
  box-shadow: 0 4px 16px rgba(128,0,32,.12);
}

.co-addr-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.co-addr-name {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #800020;
}
.co-default-badge {
  background: rgba(196,152,10,.15);
  color: #C4980A;
  border: 1px solid rgba(196,152,10,.4);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .08em;
  padding: 2px 8px;
  border-radius: 100px;
  text-transform: uppercase;
}
.co-addr-text {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 13px;
  color: #5a483a;
  line-height: 1.4;
}
.co-addr-phone {
  font-size: 12px;
  color: #800020;
  margin-top: 4px;
}

/* NEW ADDRESS FORM */
.co-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
}
@media(max-width:600px){ .co-form-grid { grid-template-columns: 1fr; } }

.co-form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.co-form-field.full {
  grid-column: 1 / -1;
}
.co-label {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #5a483a;
  letter-spacing: .02em;
}
.co-input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid rgba(196,152,10,.3);
  background: rgba(255,255,255,.9);
  font-family: 'Josefin Sans', sans-serif;
  font-size: 13px;
  color: #1a1010;
  outline: none;
  transition: border-color .2s;
}
.co-input:focus {
  border-color: #800020;
}

.co-btn-primary {
  background: linear-gradient(135deg, #800020, #5a0016);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 100px;
  font-family: 'Josefin Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: .05em;
  cursor: pointer;
  transition: transform .2s, box-shadow .2s;
}
.co-btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(128,0,32,.3);
}

.co-btn-secondary {
  background: transparent;
  color: #6b5344;
  border: 1px solid rgba(196,152,10,.3);
  padding: 12px 24px;
  border-radius: 100px;
  font-family: 'Josefin Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

/* PAYMENT OPTIONS */
.co-pay-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.co-pay-option {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-radius: 16px;
  border: 1.5px solid rgba(196,152,10,.25);
  background: rgba(255,255,255,.6);
  cursor: pointer;
  transition: all .25s ease;
}
.co-pay-option:hover {
  background: rgba(255,255,255,.9);
  border-color: rgba(196,152,10,.5);
}
.co-pay-option.selected {
  border-color: #800020;
  background: rgba(255, 249, 240, 1);
  box-shadow: 0 4px 16px rgba(128,0,32,.1);
}
.co-pay-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.co-pay-title {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #1a1010;
}
.co-pay-sub {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 11px;
  color: #7a6555;
  margin-top: 2px;
}
.co-pay-radio {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid rgba(196,152,10,.4);
  display: flex;
  align-items: center;
  justify-content: center;
}
.co-pay-option.selected .co-pay-radio {
  border-color: #800020;
  background: #800020;
}

/* ORDER SUMMARY SIDEBAR */
.co-summary {
  background: rgba(255, 249, 240, .98);
  border: 1px solid rgba(196,152,10,.3);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0,0,0,.08);
  position: sticky;
  top: 100px;
}
.co-summary-bar {
  background: linear-gradient(135deg, #800020, #4B0082);
  padding: 24px 28px;
  color: white;
}
.co-summary-bar-title {
  font-family: 'Cinzel', serif;
  font-size: 22px;
  font-weight: 600;
}
.co-summary-body {
  padding: 24px 28px;
}
.co-item-list {
  max-height: 240px;
  overflow-y: auto;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-right: 4px;
}
.co-item-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.co-item-img {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid rgba(196,152,10,.25);
}
.co-item-name {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #1a1010;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.co-item-qty {
  font-size: 11px;
  color: #7a6555;
}
.co-item-price {
  font-size: 12px;
  font-weight: 600;
  color: #800020;
}

.co-sum-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 13px;
}
.co-sum-key { color: #6b5344; }
.co-sum-val { font-weight: 600; color: #1a1010; }
.co-sum-free { color: #27ae60; font-weight: 600; display: flex; align-items: center; gap: 4px; }

.co-total-strip {
  border-top: 1.5px dashed rgba(196,152,10,.3);
  padding-top: 16px;
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.co-total-label {
  font-family: 'Cinzel', serif;
  font-size: 16px;
  font-weight: 600;
  color: #800020;
}
.co-total-val {
  font-family: 'Cinzel', serif;
  font-size: 22px;
  font-weight: 700;
  color: #800020;
}

.co-place-btn {
  width: 100%;
  padding: 16px;
  border-radius: 100px;
  background: linear-gradient(135deg, #800020 0%, #C4980A 100%);
  color: white;
  border: none;
  font-family: 'Josefin Sans', sans-serif;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform .25s, box-shadow .25s;
  box-shadow: 0 8px 24px rgba(128,0,32,.25);
  margin-bottom: 12px;
}
.co-place-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(212,175,55,.4);
}
.co-place-btn:disabled {
  opacity: .55;
  cursor: not-allowed;
  transform: none;
}

.co-place-note {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 11px;
  color: #9a8070;
  text-align: center;
}

.co-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2.5px solid rgba(255,255,255,.3);
  border-top-color: white;
  animation: coSpin .7s linear infinite;
  vertical-align: middle;
  margin-right: 8px;
}
`;

type CheckoutCreateResponse = {
  data?: {
    razorpay_order_id: string;
    amount: number;
    currency: string;
    key: string;
  };
};

type BackendCartResponse = {
  data?: {
    items?: Array<{
      product_id?: string;
      quantity?: number;
      product?: { id?: string };
    }>;
  };
};

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, loading, getCartTotal, clearCart, refreshCart } = useCart();
  const user = authService.getCurrentUser();

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [addressesError, setAddressesError] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    full_name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
  });

  const fetchAddresses = async () => {
    try {
      setAddressesLoading(true);
      setAddressesError('');
      const list = await addressApi.getAddresses();
      setAddresses(list || []);

      if (list && list.length > 0) {
        const defaultAddr = list.find((a) => a.is_default) || list[0];
        setSelectedAddressId(defaultAddr.id);
      }
    } catch (err: any) {
      console.error('Failed to load backend addresses:', err);
      setAddressesError(err?.response?.data?.message || err?.message || 'Failed to load delivery addresses');
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
    if (!loading && cart.length === 0) {
      navigate('/cart');
    }
  }, [loading, cart.length, navigate]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user?.id, navigate]);

  if (loading) {
    return (
      <>
        <style>{CSS}</style>
        <div className="co-root">
          <div className="co-wrap co-page-top">
            <div style={{ textAlign: 'center', padding: '80px 0', color: C.maroon, fontFamily: "'Josefin Sans'" }}>
              Loading checkout...
            </div>
          </div>
        </div>
      </>
    );
  }

  if (cart.length === 0 || !user) {
    return null;
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 2999 ? 0 : 150;
  const total = subtotal + shipping;

  const loadRazorpayScript = async () => {
    return new Promise<boolean>((resolve) => {
      const existingScript = document.getElementById('razorpay-sdk');
      if (existingScript) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.id = 'razorpay-sdk';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const syncFrontendCartToBackend = async () => {
    const backendCartRes = await api.get<BackendCartResponse>('/cart');
    const backendItems = backendCartRes.data?.data?.items || [];

    for (const item of backendItems) {
      const productId = item.product_id || item.product?.id;
      if (productId) {
        await api.post('/cart/remove', { product_id: productId });
      }
    }

    for (const item of cart) {
      await api.post('/cart/add', {
        product_id: item.saree.id,
        quantity: item.quantity,
      });
    }

    await refreshCart();
  };

  const handleAddNewAddress = async () => {
    if (
      !newAddressForm.full_name.trim() ||
      !newAddressForm.phone.trim() ||
      !newAddressForm.line1.trim() ||
      !newAddressForm.city.trim() ||
      !newAddressForm.state.trim() ||
      !newAddressForm.postal_code.trim()
    ) {
      toast.error('Please fill all required address fields');
      return;
    }

    try {
      const created = await addressApi.createAddress({
        full_name: newAddressForm.full_name.trim(),
        phone: newAddressForm.phone.trim(),
        line1: newAddressForm.line1.trim(),
        line2: newAddressForm.line2.trim() || undefined,
        city: newAddressForm.city.trim(),
        state: newAddressForm.state.trim(),
        postal_code: newAddressForm.postal_code.trim(),
        country: 'India',
      });
      toast.success('New address saved');
      setNewAddressForm({
        full_name: '',
        phone: '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        postal_code: '',
      });
      setShowNewAddressForm(false);
      await fetchAddresses();
      if (created?.id) {
        setSelectedAddressId(created.id);
      }
    } catch (err: any) {
      console.error('Failed to create address:', err);
      toast.error(err?.response?.data?.message || 'Failed to save address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please log in to continue');
      navigate('/login');
      return;
    }

    const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

    if (!selectedAddress) {
      toast.error('Please select or add a delivery address');
      return;
    }

    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    try {
      setIsProcessing(true);

      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        toast.error('Failed to load payment gateway');
        setIsProcessing(false);
        return;
      }

      const shippingAddress = {
        full_name: selectedAddress.full_name,
        phone: selectedAddress.phone,
        line1: selectedAddress.line1,
        line2: selectedAddress.line2 || '',
        city: selectedAddress.city,
        state: selectedAddress.state,
        postal_code: selectedAddress.postal_code,
        country: selectedAddress.country || 'India',
      };

      await syncFrontendCartToBackend();

      const createRes = await api.post<CheckoutCreateResponse>('/orders/create', {
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
      });

      const checkoutData = createRes.data?.data;

      if (!checkoutData?.razorpay_order_id || !checkoutData?.key) {
        throw new Error('Invalid checkout response');
      }

      const options = {
        key: checkoutData.key,
        amount: checkoutData.amount,
        currency: checkoutData.currency,
        name: 'Neyge Couture',
        description: 'Handloom Saree Order',
        order_id: checkoutData.razorpay_order_id,
        prefill: {
          name: user.name || selectedAddress.full_name || '',
          email: user.email || '',
          contact: user.phone || selectedAddress.phone || '',
        },
        theme: {
          color: '#800020',
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            await clearCart();
            toast.success('Payment successful!');

            const orderData = verifyRes.data?.data?.order || verifyRes.data?.order || verifyRes.data?.data || verifyRes.data;
            const orderId = orderData?.id || orderData?.order_number || response.razorpay_order_id;

            navigate(`/order-confirmation/${orderId}`, {
              state: {
                order: orderData,
                orderId: orderId,
                paymentId: response.razorpay_payment_id,
                amount: total,
                shippingAddress,
              },
            });
          } catch (err: any) {
            console.error('Payment verification failed:', err);
            toast.error(err?.response?.data?.message || 'Payment verification failed');
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast.info('Payment cancelled');
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error);
        toast.error(response.error?.description || 'Payment failed');
        setIsProcessing(false);
      });

      rzp.open();
    } catch (err: any) {
      console.error('Checkout error:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Failed to initialize payment');
      setIsProcessing(false);
    }
  };

  const PAY_OPTIONS = [
    {
      value: 'upi',
      Icon: Smartphone,
      title: 'UPI Payment',
      sub: 'Pay via Google Pay, PhonePe, Paytm',
      bg: 'rgba(59,130,246,.12)',
      border: 'rgba(59,130,246,.35)',
      color: '#2563eb',
    },
    {
      value: 'card',
      Icon: CreditCard,
      title: 'Credit / Debit Card',
      sub: 'Visa, Mastercard, RuPay',
      bg: 'rgba(139,92,246,.12)',
      border: 'rgba(139,92,246,.35)',
      color: '#7c3aed',
    },
    {
      value: 'wallet',
      Icon: Wallet,
      title: 'Net Banking & Wallets',
      sub: 'All Indian banks & digital wallets',
      bg: 'rgba(16,185,129,.12)',
      border: 'rgba(16,185,129,.35)',
      color: '#059669',
    },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="co-root">
        <div className="co-wrap co-page-top">
          <div className="co-hero co-fadein">
            <div className="co-hero-title">Checkout</div>
            <div className="co-hero-sub">Complete your handloom saree purchase securely</div>
          </div>

          <div className="co-grid">
            <div>
              <div className="co-card co-fadeup">
                <div className="co-card-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="co-card-icon">
                      <MapPin size={18} color="white" />
                    </div>
                    <h2 className="co-card-title">Delivery Address</h2>
                  </div>
                  {addresses && addresses.length > 0 && !showNewAddressForm && (
                    <button
                      type="button"
                      style={{
                        background: 'transparent',
                        border: '1px solid #C4980A',
                        color: '#800020',
                        fontSize: 12,
                        fontWeight: 600,
                        padding: '6px 12px',
                        borderRadius: 20,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                      onClick={() => setShowNewAddressForm(true)}
                    >
                      <Plus size={14} /> Add New
                    </button>
                  )}
                </div>

                {addressesLoading ? (
                  <p style={{ fontFamily: "'Josefin Sans'", fontSize: 13, color: '#9a8070', padding: '12px 0' }}>
                    Loading saved addresses...
                  </p>
                ) : addressesError ? (
                  <div style={{ padding: '12px 0' }}>
                    <p style={{ fontFamily: "'Josefin Sans'", fontSize: 13, color: '#c0392b' }}>{addressesError}</p>
                    <button
                      type="button"
                      onClick={fetchAddresses}
                      style={{
                        marginTop: 8,
                        background: '#800020',
                        color: 'white',
                        border: 'none',
                        padding: '6px 14px',
                        borderRadius: 20,
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      Retry
                    </button>
                  </div>
                ) : showNewAddressForm ? (
                  <div className="co-fadein">
                    <div className="co-form-grid">
                      <div className="co-form-field">
                        <label className="co-label">Full Name *</label>
                        <input
                          className="co-input"
                          value={newAddressForm.full_name}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, full_name: e.target.value })}
                          placeholder="Full Name"
                        />
                      </div>
                      <div className="co-form-field">
                        <label className="co-label">Phone Number *</label>
                        <input
                          className="co-input"
                          value={newAddressForm.phone}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, phone: e.target.value })}
                          placeholder="10-digit Phone"
                        />
                      </div>
                      <div className="co-form-field full">
                        <label className="co-label">Address Line 1 *</label>
                        <input
                          className="co-input"
                          value={newAddressForm.line1}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, line1: e.target.value })}
                          placeholder="House No, Building, Street"
                        />
                      </div>
                      <div className="co-form-field full">
                        <label className="co-label">Address Line 2 (Optional)</label>
                        <input
                          className="co-input"
                          value={newAddressForm.line2}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, line2: e.target.value })}
                          placeholder="Landmark, Area"
                        />
                      </div>
                      <div className="co-form-field">
                        <label className="co-label">City *</label>
                        <input
                          className="co-input"
                          value={newAddressForm.city}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, city: e.target.value })}
                          placeholder="City"
                        />
                      </div>
                      <div className="co-form-field">
                        <label className="co-label">State *</label>
                        <input
                          className="co-input"
                          value={newAddressForm.state}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, state: e.target.value })}
                          placeholder="State"
                        />
                      </div>
                      <div className="co-form-field">
                        <label className="co-label">Pincode *</label>
                        <input
                          className="co-input"
                          value={newAddressForm.postal_code}
                          onChange={(e) => setNewAddressForm({ ...newAddressForm, postal_code: e.target.value })}
                          placeholder="6-digit Pincode"
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                      <button type="button" className="co-btn-primary" onClick={handleAddNewAddress}>
                        Save & Use Address
                      </button>
                      <button
                        type="button"
                        className="co-btn-secondary"
                        onClick={() => setShowNewAddressForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : addresses.length === 0 ? (
                  <div style={{ padding: '16px 0', textAlign: 'center' }}>
                    <p style={{ fontFamily: "'Josefin Sans'", fontSize: 14, color: '#6b5344', marginBottom: 16 }}>
                      No saved addresses found. Please add a delivery address.
                    </p>
                    <button type="button" className="co-btn-primary" onClick={() => setShowNewAddressForm(true)}>
                      Add Delivery Address
                    </button>
                  </div>
                ) : (
                  <div className="co-address-list">
                    {addresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <div
                          key={addr.id}
                          className={`co-address-option${isSelected ? ' selected' : ''}`}
                          onClick={() => setSelectedAddressId(addr.id)}
                        >
                          <div className="co-addr-header">
                            <span className="co-addr-name">{addr.full_name}</span>
                            {addr.is_default && <span className="co-default-badge">DEFAULT</span>}
                          </div>
                          <div className="co-addr-text">
                            {addr.line1}
                            {addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} - {addr.postal_code}
                          </div>
                          <div className="co-addr-phone">Phone: {addr.phone}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="co-card co-fadeup co-d1">
                <div className="co-card-head">
                  <div className="co-card-icon">
                    <CreditCard size={18} color="white" />
                  </div>
                  <h2 className="co-card-title">Payment Method</h2>
                </div>

                <div className="co-pay-list">
                  {PAY_OPTIONS.map(({ value, Icon, title, sub, bg, border, color }) => (
                    <label
                      key={value}
                      className={`co-pay-option${paymentMethod === value ? ' selected' : ''}`}
                      onClick={() => setPaymentMethod(value)}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={value}
                        checked={paymentMethod === value}
                        onChange={() => setPaymentMethod(value)}
                        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                      />
                      <div className="co-pay-icon" style={{ background: bg, border: `1px solid ${border}` }}>
                        <Icon size={18} color={color} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="co-pay-title">{title}</div>
                        <div className="co-pay-sub">{sub}</div>
                      </div>
                      <div className="co-pay-radio">
                        {paymentMethod === value && (
                          <svg width="10" height="10" viewBox="0 0 20 20" fill="white">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="co-summary co-fadein co-d2">
              <div className="co-summary-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Sparkles size={13} color="rgba(212,175,55,.75)" />
                  <span style={{ fontFamily: "'Josefin Sans'", fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)' }}>
                    Neyge Couture
                  </span>
                </div>
                <div className="co-summary-bar-title">Order Summary</div>
              </div>

              <div className="co-summary-body">
                <div className="co-item-list">
                  {cart.map((item) => (
                    <div key={item.saree.id} className="co-item-row">
                      <img
                        src={item.saree.image || item.saree.images?.[0] || ''}
                        alt={item.saree.name}
                        className="co-item-img"
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="co-item-name">{item.saree.name}</div>
                        <div className="co-item-qty">Qty: {item.quantity}</div>
                        <div className="co-item-price">{formatCurrency(item.saree.price * item.quantity)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="co-sum-row">
                  <span className="co-sum-key">Subtotal</span>
                  <span className="co-sum-val">{formatCurrency(subtotal)}</span>
                </div>

                <div className="co-sum-row">
                  <span className="co-sum-key">Shipping</span>
                  {shipping === 0 ? (
                    <span className="co-sum-free">
                      <Sparkles size={12} /> FREE
                    </span>
                  ) : (
                    <span className="co-sum-val">{formatCurrency(shipping)}</span>
                  )}
                </div>

                <div className="co-total-strip">
                  <span className="co-total-label">Total Amount</span>
                  <span className="co-total-val">{formatCurrency(total)}</span>
                </div>

                <button className="co-place-btn" onClick={handlePlaceOrder} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <span className="co-spinner" />
                      Processing…
                    </>
                  ) : (
                    'Place Order ✦'
                  )}
                </button>

                <p className="co-place-note">
                  By placing this order, you agree to our Terms & Conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}