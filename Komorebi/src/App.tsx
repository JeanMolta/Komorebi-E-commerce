// App.tsx
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
import ProfilePage from './pages/ProfilePage';
import ProductPage from './pages/ProductPage';
import Register from './pages/Register';
import SignIn from './pages/SignIn';
import SearchResultsPage from './pages/SearchResultsPage'; // <<-- NUEVA IMPORTACIÓN
import './index.css';

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
        
        {/* Ruta principal '/*' que aplica el Layout (Navbar/Footer) al resto de la aplicación */}
        <Route path="/*" element={
          <>
            {/* NO NECESITA PROPS onSearchChange AQUÍ AHORA */}
            <Navbar />
            
            {/* ÚNICO BLOQUE Routes ANIDADO: Contiene todas las rutas con Layout */}
            <Routes>
              <Route path="/home" element={<HomePage />} />
              
              {/* 1. Ruta Estática para ver TODAS las CategoryCard */}
              <Route path="/categories" element={<CategoriesPage />} />
              
              {/* 2. Ruta DINÁMICA para ver los ProductCard de una categoría específica */}
              <Route path="/categories/:categoryId" element={<CategoryProductsPage />} />
              
              {/* 3. Ruta de BÚSQUEDA GENERAL: Usaremos un query param 'q' para el término de búsqueda */}
              <Route path="/search" element={<SearchResultsPage />} /> {/* <<-- RUTA DE BÚSQUEDA */}

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