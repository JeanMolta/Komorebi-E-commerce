import { Routes, Route } from 'react-router-dom';
import Navbar from './components/homepage/NavBar';
import ProductGrid from './components/homepage/ProductGrid';
import Footer from './components/homepage/Footer';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import AddProductPage from './pages/AddProductPage';
import CartPage from './pages/CartPage';
import WishListPage from './pages/WishListPage';
import ProfilePage from './pages/ProfilePage';
import ProductPage from './pages/ProductPage';
import './index.css'

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/sell" element={<AddProductPage />} />
        <Route path="/wishlist" element={<WishListPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/productos" element={<ProductGrid />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>

      <Footer komorebi="Komorebi" year={2025} />
    </>
  );
}

export default App;
