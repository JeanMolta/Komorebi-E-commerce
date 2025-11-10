import { Routes, Route } from 'react-router-dom';
import HeroSection from './components/homepage/HeroSection';
import Navbar from './components/homepage/NavBar';
import ProductGrid from './components/homepage/ProductGrid';
import Footer from './components/homepage/Footer';
// Importamos la WishlistPage para que la ruta anterior siga funcionando
import WishlistPage from './components/homepage/WishListPage'; 
import ProfilePage from './components/homepage/ProfilePage'; 
import './index.css'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<><HeroSection /><ProductGrid /></>} /> 
        
        {/* Rutas de navegación principales */}
        <Route path="/categories" element={<ProductGrid/>} />
        <Route path="/sell" element={<ProductGrid/>} />
        <Route path="/productos" element={<ProductGrid />} />

        {/* Rutas de usuario */}
        <Route path="/wishlist" element={<WishlistPage />} />
        {/* --- NUEVA RUTA PROFILE --- */}
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>

      <Footer komorebi="Komorebi" year={2025} />
    </>
  );
}

export default App;