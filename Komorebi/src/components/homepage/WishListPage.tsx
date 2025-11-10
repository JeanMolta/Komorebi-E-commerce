// src/components/homepage/WishlistPage.tsx

import React from 'react';
import { ShoppingCart, X } from 'lucide-react'; // Íconos para las acciones
import { useNavigate } from 'react-router-dom';

// --- Datos de ejemplo de la Wishlist (simulación) ---
const mockWishlistItems = [
  {
    id: 1,
    name: "Snack Matcha and white chocolate",
    price: 12000,
    imageUrl: "https://via.placeholder.com/300x300.png?text=Matcha",
    vendor: "Store japan"
  },
  {
    id: 2,
    name: "Surprise Candy Box",
    price: 35500,
    imageUrl: "https://via.placeholder.com/300x300.png?text=Mystery+Box",
    vendor: "Global Eats"
  },
  {
    id: 3,
    name: "Cherry Blossom Drink",
    price: 8500,
    imageUrl: "https://via.placeholder.com/300x300.png?text=Energy+Drink",
    vendor: "Fresh Drinks"
  },
];

// Función para formatear el precio (tomada de tu ProductCard.tsx)
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price);
};

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();

  // Funciones de simulación
  const removeItem = (id: number) => {
    alert(`Product ${id} deleted from wishlist.`);
    // Lógica para eliminar el producto de la lista (en una app real, aquí se usaría el estado o una API)
  };

  const moveToCart = (item: any) => {
    alert(`"${item.name}" moved to the cart.`);
    // Aquí se añadiría el producto al carrito y se eliminaría de la wishlist
    // Lógica para añadir a carrito y eliminar de la Wishlist
  };

  return (
    <div className="container mx-auto px-4 py-12" style={{ minHeight: 'calc(100vh - 200px)' }}>
      <h1 
        className="text-4xl font-bold text-center mb-10" 
        style={{ color: 'var(--komorebi-black)' }}
      >
        Your Wishlist
      </h1>
      
      {mockWishlistItems.length === 0 ? (
        <div className="text-center py-20 bg-white/50 rounded-xl shadow-lg">
          <p 
            className="text-2xl font-semibold" 
            style={{ color: 'var(--komorebi-black)' }}
          >
            Your wishlist is empty.
          </p>
          <p className="mt-4 text-lg text-gray-600">
            save items to your wishlist to view them here.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-8 bg-[var(--komorebi-yellow)]/100 text-[var(--komorebi-black)] px-6 py-3 rounded-full hover:brightness-95 transition-colors font-bold shadow-md"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {mockWishlistItems.map((item) => (
            
            <div 
              key={item.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl border border-white"
            >
              <div className="w-full h-48 bg-gray-100 relative">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover" 
                  loading="lazy"
                />
                {/* Botón de Remover de la list */}
                <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-2 text-gray-500 hover:text-[var(--komorebi-pink)] transition-colors shadow-md"
                    title="Eliminar de la Wishlist"
                >
                    <X size={20} />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <h3 
                    className="text-lg font-semibold text-gray-800 line-clamp-2" 
                    style={{ color: 'var(--komorebi-black)' }}
                    >
                    {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{item.vendor}</p>
                </div>

                <div className="mt-4">
                    <p 
                    className="text-2xl font-bold" 
                    style={{ color: 'var(--komorebi-pink)' }}
                    >
                    {formatPrice(item.price)}
                    </p>
                    
                    {/* Botón para mover a carrito */}
                    <button 
                        onClick={() => moveToCart(item)}
                        className="w-full mt-3 flex items-center justify-center gap-2 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 hover:opacity-90 hover:shadow-lg text-sm"
                        style={{ backgroundColor: 'var(--komorebi-black)' }}
                    >
                        <ShoppingCart size={18} /> Move to Cart
                    </button>
                </div>
              </div>
            </div>

          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;