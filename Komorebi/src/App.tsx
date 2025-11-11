import { Routes, Route } from 'react-router-dom';

// Layout components
import Navbar from './components/homepage/NavBar';
import Footer from './components/homepage/Footer';
import ScrollToTop from './components/ScrollToTop';

// Page components
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryProductsPage from './pages/CategoryProductsPage';
import WishListPage from './pages/WishListPage';
import ProfilePage from './pages/ProfilePage';
import SellProductPage from './pages/SellProductPage';
import SignIn from './pages/SignIn';
import Register from './pages/Register';

import './index.css'

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/categories/:category" element={<CategoryProductsPage />} />
        <Route path="/wishlist" element={<WishListPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/sell" element={<SellProductPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
      <Footer komorebi="Komorebi" year={2025} />
    </>
  );
}

export default App;