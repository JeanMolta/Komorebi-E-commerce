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
import Register from './pages/Register';
import SignIn from './pages/SignIn';
import './index.css'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Ruta principal - SignIn como página de inicio */}
        <Route path="/" element={<SignIn />} />
        
        {/* Rutas de autenticación SIN navbar/footer */}
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<SignIn />} />
        
        {/* Rutas principales CON navbar/footer */}
        <Route path="/*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/home" element={<HomePage />} />
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
        } />
      </Routes>
    </>
  );
}

export default App;
