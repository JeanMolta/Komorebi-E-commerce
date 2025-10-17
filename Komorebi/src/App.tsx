import { Routes, Route } from 'react-router-dom';
import HeroSection from './components/homepage/HeroSection';
import Navbar from './components/homepage/NavBar';
import ProductGrid from './components/homepage/ProductGrid';
import Footer from './components/homepage/Footer';
import './index.css'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HeroSection />} />
                <Route path="/categories" element={<ProductGrid/>} />
        
        <Route path="/productos" element={<ProductGrid />} />
      </Routes>

      <ProductGrid/>

      <Footer komorebi="Komorebi" year={2025} />
    </>
  );
}

export default App;
