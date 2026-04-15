// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Toaster } from 'sonner';
// import { Header } from '@/components/layout/Header';
// import { Footer } from '@/components/layout/Footer';
// import HomePage from '@/pages/HomePage';
// import { ShopPage } from '@/pages/ShopPage';
// import { ProductDetailPage } from '@/pages/ProductDetailPage';
// import { CartPage } from '@/pages/CartPage';
// import { WishlistPage } from '@/pages/WishlistPage';
// import { CheckoutPage } from '@/pages/CheckoutPage';
// import { LoginPage } from '@/pages/LoginPage';
// import { ProfilePage } from '@/pages/ProfilePage';
// import { VideoShoppingPage } from '@/pages/VideoShoppingPage';
// import { ArtisanPage } from '@/pages/OurArtician';
// import { Chatbot } from '@/components/features/Chatbot';
// import {SareeBackdropSection} from '@/pages/SareeBackdropSection';
// import { OrderConfirmationPage } from "@/pages/OrderConfirmationPage";

// import AdminRoute from "@/admin/components/AdminRoute";
// import AdminLogin from "@/admin/pages/AdminLogin";
// import AdminDashboard from "@/admin/pages/AdminDashboard";
// import AdminProducts from "@/admin/pages/AdminProducts";
// import ProductForm from "@/admin/pages/ProductForm";
// import './styles/luxury-styles.css';

// function App() {
//   return (
//     <Router>
//       <div className="flex flex-col min-h-screen">
//         <Header />
//         <main className="flex-1">
//           <Routes>
//             <Route path="/" element={<HomePage />} />
//             <Route path="/shop" element={<ShopPage />} />
//             <Route path="/collections/:type" element={<ShopPage />} />
//             {/* <Route path="/product/:id" element={<ProductDetailPage />} /> */}
//             <Route path="/product/:slug" element={<ProductDetailPage />} />
//             <Route path="/cart" element={<CartPage />} />
//             <Route path="/wishlist" element={<WishlistPage />} />
//             <Route path="/checkout" element={<CheckoutPage />} />
//             <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />



//             <Route path="/login" element={<LoginPage />} />
//             <Route path="/profile" element={<ProfilePage />} />
//             <Route path="/video-shopping" element={<VideoShoppingPage />} />
//             <Route path="/about" element={<ArtisanPage />} />
//             <Route path="/backdrop" element={<SareeBackdropSection />} />
//           </Routes>
//           <Routes>
//   {/* public routes */}
//   <Route path="/admin/login" element={<AdminLogin />} />

//   {/* protected admin routes */}
//   <Route element={<AdminRoute />}>
//     <Route path="/admin/dashboard" element={<AdminDashboard />} />
//     <Route path="/admin/products" element={<AdminProducts />} />
//     <Route path="/admin/products/new" element={<ProductForm />} />
//     <Route path="/admin/products/:id/edit" element={<ProductForm />} />
//   </Route>
// </Routes>
//         </main>
//         <Footer />
//         <Toaster position="top-center" richColors />
//         <Chatbot />
//       </div>
//     </Router>
//   );
// }

// export default App;








import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
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
import { SareeBackdropSection } from '@/pages/SareeBackdropSection';
import { OrderConfirmationPage } from '@/pages/OrderConfirmationPage';
import { CollectionDetailPage } from '@/pages/collections/CollectionDetailPage';
import { CollectionsPage } from '@/pages/collections/CollectionsPage';

import AdminRoute from '@/admin/components/AdminRoute';
import AdminLogin from '@/admin/pages/AdminLogin';
import AdminDashboard from '@/admin/pages/AdminDashboard';
import AdminProducts from '@/admin/pages/AdminProducts';
import ProductForm from '@/admin/pages/ProductForm';
import AdminCollections from "@/admin/pages/AdminCollections";
import CollectionForm from "@/admin/pages/CollectionForm";
import AdminOrders from "@/admin/pages/AdminOrders";
import AdminOrderDetail from "@/admin/pages/AdminOrderDetail";
import AdminVideoBookingsPage from './admin/pages/AdminVideoBookingsPage';
import './styles/luxury-styles.css';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Header />}

      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          {/* <Route path="/collections/:type" element={<ShopPage />} /> */}
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
          <Route path="/collections/:slug" element={<CollectionDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/video-shopping" element={<VideoShoppingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/backdrop" element={<SareeBackdropSection />} />
          <Route path="/collections" element={<CollectionsPage />} />

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
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
            <Route path="/admin/video-bookings" element={<AdminVideoBookingsPage />} />
          </Route>
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <Chatbot />}

      <Toaster position="top-center" richColors />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;