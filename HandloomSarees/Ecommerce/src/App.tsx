import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/hooks/useCarts';

import HomePage from '@/pages/HomePage';
import { ShopPage } from '@/pages/ShopPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CartPage } from '@/pages/CartPage';
import { WishlistPage } from '@/pages/WishlistPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { LoginPage } from '@/pages/LoginPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { VideoShoppingPage } from '@/pages/VideoShoppingPage';
import AboutPage from '@/pages/AboutPage';
import { Chatbot } from '@/components/features/Chatbot';
import { FestivePopup } from '@/components/features/FestivePopup';
import { SareeBackdropSection } from '@/pages/SareeBackdropSection';
import { OrderConfirmationPage } from '@/pages/OrderConfirmationPage';
import { CollectionDetailPage } from '@/pages/collections/CollectionDetailPage';
import { CollectionsPage } from '@/pages/collections/CollectionsPage';
import FestiveCollectionPage from '@/pages/FestiveCollectionPage';
import NotFound from '@/pages/NotFound';
import {
  CancellationRefundPage,
  ContactPage,
  CookiesPage,
  FaqPage,
  PrivacyPage,
  ReturnsPage,
  ShippingPage,
  TermsPage,
  TrackPage,
} from '@/pages/PolicyPages';
// ── NEW ──
import SkinTonePage from '@/pages/SkinTonePage';

import AdminRoute from '@/admin/components/AdminRoute';
import AdminLogin from '@/admin/pages/AdminLogin';
import AdminDashboard from '@/admin/pages/AdminDashboard';
import AdminProducts from '@/admin/pages/AdminProducts';
import ProductForm from '@/admin/pages/ProductForm';
import AdminCollections from '@/admin/pages/AdminCollections';
import CollectionForm from '@/admin/pages/CollectionForm';
import AdminOrders from '@/admin/pages/AdminOrders';
import AdminOrderDetail from '@/admin/pages/AdminOrderDetail';
import AdminVideoBookingsPage from '@/admin/pages/AdminVideoBookingsPage';
import AdminFestiveCollections from '@/admin/pages/AdminFestiveCollections';
import FestiveCollectionForm from '@/admin/pages/FestiveCollectionForm';
import AdminChatbotLeads from "@/admin/pages/AdminChatbotLeads";
import { shouldNoindex } from '@/config/env';
import './styles/luxury-styles.css';

function RobotsMeta() {
  useEffect(() => {
    const existing = document.querySelector<HTMLMetaElement>('meta[name="robots"]');

    if (shouldNoindex) {
      const meta = existing ?? document.createElement('meta');
      meta.name = 'robots';
      meta.content = 'noindex,nofollow';

      if (!existing) {
        document.head.appendChild(meta);
      }
    } else if (existing?.content.includes('noindex')) {
      existing.remove();
    }
  }, []);

  return null;
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      <RobotsMeta />
      {!isAdminRoute && <Header />}

      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:slug" element={<CollectionDetailPage />} />
          <Route path="/festive/:slug" element={<FestiveCollectionPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/video-shopping" element={<VideoShoppingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/cancellation-refund" element={<CancellationRefundPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="/track" element={<TrackPage />} />
          <Route path="/backdrop" element={<SareeBackdropSection />} />
          {/* ── NEW ── */}
          <Route path="/skin-tone-match" element={<SkinTonePage />} />

          {/* Admin public route */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin protected routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/products/new" element={<ProductForm />} />
            <Route path="/admin/products/:id/edit" element={<ProductForm />} />

            <Route path="/admin/collections" element={<AdminCollections />} />
            <Route path="/admin/collections/new" element={<CollectionForm />} />
            <Route path="/admin/collections/:id/edit" element={<CollectionForm />} />

            <Route path="/admin/festive-collections" element={<AdminFestiveCollections />} />
            <Route path="/admin/festive-collections/new" element={<FestiveCollectionForm />} />
            <Route path="/admin/festive-collections/:id/edit" element={<FestiveCollectionForm />} />

            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
            <Route path="/admin/video-bookings" element={<AdminVideoBookingsPage />} />
            <Route path="/admin/chatbot-leads" element={<AdminChatbotLeads />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <FestivePopup />}
      {!isAdminRoute && <Chatbot />}

      <Toaster position="top-center" richColors />
    </div>
  );
}

function App() {
  return (
    <Router>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </Router>
  );
}

export default App;
