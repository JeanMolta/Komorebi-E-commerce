import { Routes, Route } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import Navbar from './components/NavBar';
import ProductGrid from './components/ProductGrid';
import './index.css'
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HeroSection />} />

        <Route path="/productos" element={<ProductGrid />} />
      </Routes>

      <ProductGrid/>

      <Footer komorebi="Komorebi" year={2025} />
    </>
  );
}

export default App;
