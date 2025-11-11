// components/homepage/NavBar.tsx
import { useEffect, useState } from "react";
import { Search, Heart, ShoppingCart, User } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom"; // <<-- IMPORTANTE: Usar 'react-router-dom' si estás en React Router v6+
import NotificationMenu from "./NotificationMenu";

// Eliminamos la interfaz NavbarProps y el prop onSearchChange
// interface NavbarProps {
//   onSearchChange: (term: string) => void;
// }

// export default function Navbar({ onSearchChange }: NavbarProps) {
export default function Navbar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(""); // <<-- NUEVO ESTADO LOCAL

  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  
  // Función para cerrar el menú móvil después de navegar
  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false); // Cierra el menú móvil
    navigate(path);
  };


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) setIsSticky(true);
      else setIsSticky(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (term: string) => {
    // 1. Limpia el término y redirige si no está vacío
    const trimmedTerm = term.trim();
    if (trimmedTerm) {
        // 2. Navega a la nueva ruta de búsqueda usando un query parameter 'q'
        navigate(`/search?q=${encodeURIComponent(trimmedTerm)}`);
        // Opcional: Cierra el menú móvil después de la búsqueda
        setMobileSearchOpen(false); 
    }
  };

  // Función para manejar el cambio en el input (solo actualiza el estado local)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Función para manejar la tecla Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm);
    }
  };

  return (
    <>
      {/* Main navbar with conditional sticky styling */}
      <nav
        className={`
          ${
            isSticky
              ? "fixed top-0 left-0 w-full z-50 bg-white/30 backdrop-blur-md border-b border-white/30 shadow-sm transform translate-y-0 opacity-100 transition-all duration-300 ease-out"
              : "absolute top-0 left-0 w-full bg-transparent border-b border-white/0 z-10 transform -translate-y-0.5 opacity-90 transition-all duration-300 ease-out"
          }
        `}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 relative">
          {/* Left section: Logo and navigation links */}
          <div className="flex items-center gap-4">
            {/* Logo button */}
            <button
              className="text-[var(--komorebi-yellow)] text-2xl font-bold hover:text-[var(--komorebi-black)] transition-colors"
              onClick={() => navigate("/home")} // Cambié a /home para la landing
            >
              Komorebi
            </button>

            {/* Desktop navigation links */}
            <div className="hidden sm:flex items-center gap-4 text-sm text-[var(--komorebi-black)] ml-12">
              <NavLink to="/categories">
                <button className="hover:text-[var(--komorebi-yellow)] transition-colors font-medium">
                  Categories
                </button>
              </NavLink>
              <NavLink to="/sell">
                <button className="hover:text-[var(--komorebi-yellow)] transition-colors font-medium">
                  Sell
                </button>
              </NavLink>
            </div>
          </div>

          {/* Center section: Desktop search bar */}
          <div className="hidden sm:flex items-center bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 w-1/2 sm:w-1/3">
            <Search size={18} className="text-[var(--komorebi-black)]/70" />
            <input
              type="text"
              placeholder="Search for snacks..."
              className="ml-2 w-full bg-transparent outline-none placeholder:text-[var(--komorebi-black)]/50 text-sm"
              value={searchTerm} // Controlado por el estado
              onChange={handleInputChange}
              onKeyDown={handleKeyDown} // Maneja la tecla Enter
            />
            {/* Opcional: Un botón para buscar si no quieres depender solo de Enter */}
            {/* <button onClick={() => handleSearch(searchTerm)} .../> */}
          </div>

          {/* Right section: User actions and mobile buttons */}
          <div className="flex items-center gap-3">
            {/* Desktop user action icons */}
            <div className="hidden sm:flex items-center gap-5 text-[var(--komorebi-black)]">
              
              {/* WISHLIST (Desktop) */}
              <NavLink to="/wishlist">
                <Heart
                  size={22}
                  className="cursor-pointer hover:text-[var(--komorebi-yellow)] transition-colors"
                />
              </NavLink>

              <NotificationMenu />
              
              <NavLink to="/cart">
                <ShoppingCart
                  size={22}
                  className="cursor-pointer hover:text-[var(--komorebi-yellow)] transition-colors"
                />
              </NavLink>
              
              <NavLink to="/profile">
                <User
                  size={22}
                  className="cursor-pointer hover:text-[var(--komorebi-yellow)] transition-colors"
                />
              </NavLink>
            </div>

            {/* Mobile search toggle button */}
            <button
              className="sm:hidden inline-flex items-center justify-center h-8 w-8 rounded-md text-[var(--komorebi-black)] hover:text-[var(--komorebi-yellow)] transition-colors"
              aria-label="Open search"
              onClick={() => {
                setMobileSearchOpen((v) => !v);
                if (!mobileSearchOpen) setMobileMenuOpen(false);
              }}
            >
              <Search size={18} />
            </button>

            {/* Mobile menu toggle button (hamburger icon) */}
            <button
              className="sm:hidden inline-flex items-center justify-center h-8 w-8 rounded-md text-[var(--komorebi-black)] hover:text-[var(--komorebi-yellow)] transition-colors"
              aria-label="Open menu"
              onClick={() => {
                setMobileMenuOpen((v) => !v);
                if (!mobileMenuOpen) setMobileSearchOpen(false);
              }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile search bar (appears when search is toggled) */}
          {mobileSearchOpen && (
            <div
              className="sm:hidden absolute top-1/2 left-40 right-30 transform -translate-y-1/2"
              role="search"
            >
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <Search size={18} className="text-[var(--komorebi-black)]/70" />
                </div>
                <input
                  autoFocus
                  className="w-full pl-11 pr-4 py-2 rounded-full bg-[var(--komorebi-gray)] text-sm placeholder:text-[var(--komorebi-black)]/50 outline-none transition-all"
                  placeholder="Search for snacks..."
                  value={searchTerm} // Controlado por el estado
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown} // Maneja la tecla Enter
                  onBlur={() => {
                    // Opcional: Puedes agregar un timeout aquí si quieres que el input mantenga el foco
                    // para permitir hacer clic, pero por ahora solo manejaremos ESC o ENTER.
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile menu dropdown */}
        <div
          className={`sm:hidden absolute top-full left-0 w-full z-40 transition-transform duration-200 ${
            mobileMenuOpen ? "transform translate-y-0 opacity-100" : "transform -translate-y-2 opacity-0 pointer-events-none"
          }`}
        >
          <div className="bg-white/20 backdrop-blur-md border-t border-white/30 shadow-lg">
            <div className="px-3 py-3">
              {/* Horizontal scrollable menu with all navigation options */}
              <div className="flex items-center justify-between gap-4 overflow-x-auto whitespace-nowrap scrollbar-hidden">
                
                {/* Enlaces principales */}
                <button 
                  onClick={() => handleNavClick("/categories")}
                  className="text-left text-base font-medium text-[var(--komorebi-black)] hover:text-[var(--komorebi-yellow)] mr-4"
                >
                  Categories
                </button>
                <button 
                  onClick={() => handleNavClick("/sell")}
                  className="text-left text-base font-medium text-[var(--komorebi-black)] hover:text-[var(--komorebi-yellow)] mr-4"
                >
                  Sell
                </button>

                {/* Vertical divider */}
                <div className="h-6 border-l border-white/10 mx-2" />

                {/* Mobile user action buttons */}
                <button 
                  onClick={() => handleNavClick("/wishlist")} // <-- WISHLIST (Móvil)
                  className="inline-flex items-center gap-2 text-[var(--komorebi-black)] hover:text-[var(--komorebi-yellow)] mr-4"
                >
                  <Heart size={20} /> 
                </button>

                <button 
                  onClick={() => handleNavClick("/cart")}
                  className="inline-flex items-center gap-2 text-[var(--komorebi-black)] hover:text-[var(--komorebi-yellow)] mr-4"
                >
                  <ShoppingCart size={20} /> 
                </button>

                <div className="inline-flex items-center mr-4">
                  <NotificationMenu />
                </div>

                <button 
                  onClick={() => handleNavClick("/profile")}
                  className="inline-flex items-center gap-2 text-[var(--komorebi-black)] hover:text-[var(--komorebi-yellow)] mr-4"
                >
                  <User size={20} /> 
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}