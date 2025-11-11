import { Routes, Route } from 'react-router-dom';

// Layout components
import Navbar from './components/homepage/NavBar';
import Footer from './components/homepage/Footer';
import ScrollToTop from './components/ScrollToTop';

// Authentication pages (NO navbar/footer)
import SignIn from './pages/SignIn';
import Register from './pages/Register';

// Main app pages (WITH navbar/footer)
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryProductsPage from './pages/CategoryProductsPage';
import WishListPage from './pages/WishListPage';
import SellProductPage from './pages/SellProductPage';
import ProfilePage from './pages/ProfilePage';

import './index.css'

// Layout component for main app pages (with navbar and footer)
const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    {children}
    <Footer komorebi="Komorebi" year={2025} />
  </>
);

// Layout component for auth pages (clean, no navbar/footer)
const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    {children}
  </>
);

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* AUTH ROUTES - No navbar/footer, SignIn as default */}
        <Route path="/" element={<AuthLayout><SignIn /></AuthLayout>} />
        <Route path="/signin" element={<AuthLayout><SignIn /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
        
        {/* MAIN APP ROUTES - With navbar/footer */}
        <Route path="/home" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/product/:id" element={<MainLayout><ProductPage /></MainLayout>} />
        <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
        <Route path="/categories" element={<MainLayout><CategoriesPage /></MainLayout>} />
        <Route path="/categories/:category" element={<MainLayout><CategoryProductsPage /></MainLayout>} />
        <Route path="/wishlist" element={<MainLayout><WishListPage /></MainLayout>} />
        <Route path="/sell" element={<MainLayout><SellProductPage /></MainLayout>} />
        <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
        
        {/* 404 - Clean layout */}
        <Route path="*" element={<AuthLayout><div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Page not found</h1></div></AuthLayout>} />
      </Routes>
    </>
  );
}

export default App;