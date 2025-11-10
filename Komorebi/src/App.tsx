import { Routes, Route } from 'react-router-dom';
import HeroSection from './components/homepage/HeroSection';
import Navbar from './components/homepage/NavBar';
import ProductGrid from './components/homepage/ProductGrid';
import Footer from './components/homepage/Footer';
import WishlistPage from './components/homepage/WhishListPage'; // 
import './index.css'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Ruta principal ahora incluye Hero y ProductGrid */}
        <Route 
          path="/" 
          element={
            <>
              <HeroSection />
              <ProductGrid /> {/* <-- 3. CORRECCIÓN: Movido aquí */}
            </>
          } 
        />
        
        <Route path="/categories" element={<ProductGrid/>} />
        <Route path="/sell" element={<ProductGrid/>} />
        <Route path="/productos" element={<ProductGrid />} />

        {/* --- NUEVA RUTA WISHLIST --- */}
        <Route path="/wishlist" element={<WishlistPage />} /> {/* <-- 2. AÑADIR RUTA */}

      </Routes>

      {/* <ProductGrid/> */} {/* <-- 3. CORRECCIÓN: Eliminar de aquí */}

      <Footer komorebi="Komorebi" year={2025} />
    </>
  );
}

export default App;