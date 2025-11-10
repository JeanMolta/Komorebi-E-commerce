import { useEffect, useState } from "react";
import { Search, Heart, ShoppingCart, User, Menu, X } from "lucide-react"; // Importamos 'Menu' y 'X' para el toggle del menú móvil
import { NavLink, useNavigate } from "react-router-dom"; // muchachos me perdi ayuda (ana)
import NotificationMenu from "./NotificationMenu";

export default function Navbar() {
  const navigate = useNavigate();

  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) setIsSticky(true);
      else setIsSticky(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Función para cerrar el menú móvil después de navegar
  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`
          ${
            isSticky
              ? "fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-white/30 shadow-sm transform translate-y-0 opacity-100 transition-all duration-300 ease-out"
              : "absolute top-0 left-0 w-full bg-transparent border-b border-white/0 z-10 transform -translate-y-0.5 opacity-90 transition-all duration-300 ease-out"
          }
        `}
      >
        {/* Contenedor principal de la barra de navegación */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo y Enlaces Principales (Desktop) */}
            <div className="flex items-center">
              {/* Logo */}
              <NavLink to="/" className="text-2xl font-bold" style={{ color: 'var(--komorebi-black)' }}>
                Komorebi
              </NavLink>

              {/* Enlaces principales (Desktop) */}
              <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                <NavLink
                  to="/categories"
                  className={({ isActive }) =>
                    `text-[var(--komorebi-black)] hover:text-[var(--komorebi-pink)] transition-colors text-base font-medium flex items-center h-full ${
                      isActive ? "border-b-2 border-[var(--komorebi-pink)]" : ""
                    }`
                  }
                >
                  Categories
                </NavLink>
                <NavLink
                  to="/sell"
                  className={({ isActive }) =>
                    `text-[var(--komorebi-black)] hover:text-[var(--komorebi-pink)] transition-colors text-base font-medium flex items-center h-full ${
                      isActive ? "border-b-2 border-[var(--komorebi-pink)]" : ""
                    }`
                  }
                >
                  Sell
                </NavLink>
              </div>
            </div>

            {/* Íconos de Usuario y Acciones (Desktop) */}
            <div className="hidden sm:flex items-center gap-5 text-[var(--komorebi-black)]">
              
              {/* Buscador (Desktop) */}
              <button
                className="hover:text-[var(--komorebi-yellow)] transition-colors"
                onClick={() => navigate("/search")} // Simula la navegación a la búsqueda
              >
                <Search size={22} />
              </button>

              {/* WISHLIST: AÑADIDO EL EVENTO ONCLICK */}
              <Heart
                size={22}
                className="cursor-pointer hover:text-[var(--komorebi-yellow)] transition-colors"
                onClick={() => navigate('/wishlist')}
              />

              <ShoppingCart
                size={22}
                className="cursor-pointer hover:text-[var(--komorebi-yellow)] transition-colors"
                onClick={() => navigate("/cart")}
              />

              <NotificationMenu />

              <User
                size={22}
                className="cursor-pointer hover:text-[var(--komorebi-yellow)] transition-colors"
                onClick={() => navigate("/profile")}
              />
            </div>

            {/* Botones Móviles (Search/Menu) */}
            <div className="flex sm:hidden items-center gap-3">
              <button
                className="text-[var(--komorebi-black)] hover:text-[var(--komorebi-yellow)] p-1"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              >
                <Search size={24} />
              </button>
              <button
                className="text-[var(--komorebi-black)] hover:text-[var(--komorebi-yellow)] p-1"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Barra de Búsqueda Móvil */}
        {mobileSearchOpen && (
          <div className="sm:hidden px-4 pb-4">
            <input
              type="search"
              placeholder="Search for snacks..."
              className="w-full p-2 rounded-full border border-gray-300 focus:border-[var(--komorebi-yellow)]"
              // Agrega lógica de búsqueda aquí si es necesario
            />
          </div>
        )}

        {/* Menú Móvil */}
        {mobileMenuOpen && (
          <div className="sm:hidden pb-3 bg-white/90 backdrop-blur-md border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              
              {/* Enlaces principales */}
              <button
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[var(--komorebi-black)] hover:bg-[var(--komorebi-green)]"
                onClick={() => handleNavClick("/categories")}
              >
                Categories
              </button>
              <button
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[var(--komorebi-black)] hover:bg-[var(--komorebi-green)]"
                onClick={() => handleNavClick("/sell")}
              >
                Sell
              </button>

              <hr className="border-t border-gray-200 my-2" />

              {/* Íconos de Acción (Móvil) */}
              <div className="flex justify-around items-center pt-2">
                
                {/* Ícono de Wishlist (Móvil): AÑADIDO EL EVENTO ONCLICK */}
                <button 
                  className="inline-flex flex-col items-center gap-1 text-[var(--komorebi-black)] hover:text-[var(--komorebi-yellow)]"
                  onClick={() => handleNavClick('/wishlist')}
                >
                  <Heart size={20} />
                  <span className="text-xs">Wishlist</span>
                </button>

                <button 
                  className="inline-flex flex-col items-center gap-1 text-[var(--komorebi-black)] hover:text-[var(--komorebi-yellow)]"
                  onClick={() => handleNavClick('/cart')}
                >
                  <ShoppingCart size={20} />
                  <span className="text-xs">Cart</span>
                </button>

                <button
                  className="inline-flex flex-col items-center gap-1 text-[var(--komorebi-black)] hover:text-[var(--komorebi-yellow)]"
                  onClick={() => handleNavClick("/profile")}
                >
                  <User size={20} />
                  <span className="text-xs">Profile</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}