import { Routes, Route } from 'react-router-dom';
import Navbar from './components/homepage/NavBar';
import ProductGrid from './components/homepage/ProductGrid';
import Footer from './components/homepage/Footer';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryProductsPage from './pages/CategoryProductsPage';
import AddProductPage from './pages/SellProductPage';
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
      {/* Primer bloque Routes: Maneja las rutas de nivel superior (Auth y el Layout principal) */}
      <Routes>
        
        {/* Rutas de Autenticación SIN Navbar/Footer */}
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<SignIn />} />
        
        {/* Ruta principal '/*' que aplica el Layout (Navbar/Footer) al resto de la aplicación */}
        <Route path="/*" element={
          <>
            <Navbar />
            
            {/* ÚNICO BLOQUE Routes ANIDADO: Contiene todas las rutas con Layout */}
            <Routes>
              <Route path="/home" element={<HomePage />} />
              
              {/* 1. Ruta Estática para ver TODAS las CategoryCard */}
              <Route path="/categories" element={<CategoriesPage />} />
              
              {/* 2. Ruta DINÁMICA para ver los ProductCard de una categoría específica */}
              <Route path="/categories/:categoryId" element={<CategoryProductsPage />} />
              
              {/* Ruta para producto individual */}
              <Route path="/product/:id" element={<ProductPage />} />

              {/* Otras rutas */}
              <Route path="/sell" element={<AddProductPage />} />
              <Route path="/wishlist" element={<WishListPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/productos" element={<ProductGrid />} />
              
              {/* Rutas no definidas (404) pueden ir aquí si se desea */}
              <Route path="*" element={<div>404 Not Found</div>} />

            </Routes>
            
            <Footer komorebi="Komorebi" year={2025} />
          </>
        } />
      </Routes>
    </>
  );
}

export default App;