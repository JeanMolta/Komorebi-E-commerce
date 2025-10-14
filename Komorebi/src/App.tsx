import { Routes, Route } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import Navbar from './components/NavBar';
import './index.css'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HeroSection />} />
      </Routes>
    </>
  );
}

export default App
