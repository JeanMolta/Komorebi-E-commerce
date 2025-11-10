// src/components/homepage/WishlistPage.tsx
import React from 'react';

// --- Datos de ejemplo ---
// En una aplicación real, esto vendría de un estado global (como Context) o una API
const mockWishlistItems = [
  {
    id: 1,
    name: "Producto de Deseo 1",
    price: "$120.00",
    imageUrl: "https://via.placeholder.com/300x300.png?text=Producto+1"
  },
  {
    id: 2,
    name: "Producto de Deseo 2",
    price: "$85.00",
    imageUrl: "https://via.placeholder.com/300x300.png?text=Producto+2"
  },
  {
    id: 3,
    name: "Producto de Deseo 3",
    price: "$210.00",
    imageUrl: "https://via.placeholder.com/300x300.png?text=Producto+3"
  }
];

const WishlistPage: React.FC = () => {
  return (
    // Usamos min-h-screen para asegurar que el footer no se suba si hay pocos items
    <div className="container mx-auto px-4 py-12" style={{ minHeight: 'calc(100vh - 200px)' }}>
      <h1 
        className="text-4xl font-bold text-center mb-10" 
        style={{ color: 'var(--komorebi-black)' }}
      >
        Mi Lista de Deseos
      </h1>
      
      {mockWishlistItems.length === 0 ? (
        <p 
          className="text-center text-xl" 
          style={{ color: 'var(--komorebi-gray)' }}
        >
          Aún no has guardado productos en tu lista.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          
          {/* Iteramos sobre los productos de la lista */}
          {mockWishlistItems.map((item) => (
            
            // --- Inicio de la Tarjeta de Producto (Product Card) ---
            <div 
              key={item.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            >
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-full h-64 object-cover" 
              />
              <div className="p-5">
                <h3 
                  className="text-lg font-semibold truncate" 
                  style={{ color: 'var(--komorebi-black)' }}
                >
                  {item.name}
                </h3>
                <p 
                  className="mt-2 text-xl font-medium" 
                  style={{ color: 'var(--komorebi-pink)' }}
                >
                  {item.price}
                </p>
                <button 
                  className="w-full mt-4 text-white font-bold py-2 px-4 rounded transition-opacity hover:opacity-90"
                  style={{ backgroundColor: 'var(--komorebi-pink)' }}
                >
                  Eliminar
                </button>
              </div>
            </div>
            // --- Fin de la Tarjeta de Producto ---

          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;