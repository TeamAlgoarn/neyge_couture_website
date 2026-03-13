import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { ArtisanPage } from '@/pages/OurArtician';
import { Chatbot } from '@/components/features/Chatbot';
import {SareeBackdropSection} from '@/pages/SareeBackdropSection';
import './styles/luxury-styles.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/collections/:type" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/video-shopping" element={<VideoShoppingPage />} />
            <Route path="/about" element={<ArtisanPage />} />
            <Route path="/backdrop" element={<SareeBackdropSection />} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-center" richColors />
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
