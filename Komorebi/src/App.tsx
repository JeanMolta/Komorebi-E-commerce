import { Routes, Route } from 'react-router-dom';
import HeroSection from './components/homepage/HeroSection';
import Navbar from './components/homepage/NavBar';
import ProductGrid from './components/homepage/ProductGrid';
import Footer from './components/homepage/Footer';
import WishlistPage from './components/homepage/WishListPage'; // <-- IMPORTACIÓN
import './index.css'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* CORRECCIÓN: La ruta principal incluye Hero y ProductGrid */}
        <Route path="/" element={<><HeroSection /><ProductGrid /></>} /> 
        
        <Route path="/categories" element={<ProductGrid/>} />
        <Route path="/sell" element={<ProductGrid/>} />
        <Route path="/productos" element={<ProductGrid />} />

        {/* --- NUEVA RUTA WISHLIST --- */}
        <Route path="/wishlist" element={<WishlistPage />} />
      </Routes>

      <Footer komorebi="Komorebi" year={2025} />
    </>
  );
}

export default App;