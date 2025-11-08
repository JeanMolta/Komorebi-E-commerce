import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom'; // Para leer los query params
import ProductCard from '../components/homepage/ProductCard'; 
import productsData from '../data/products.json'; 

interface Product {
  id: string;
  name: string;
  vendor: string;
  price: number;
  image: string; 
  category: string; 
}

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('q') || ''; // Obtiene el valor de 'q'
  
  const productsArray: Product[] = productsData as Product[]; 

  const filteredProducts: Product[] = useMemo(() => {
    if (!searchTerm.trim()) {
      return []; 
    }

    const lowerCaseTerm = searchTerm.toLowerCase();

    // Filtra por nombre o por vendor, ignorando mayúsculas/minúsculas
    return productsArray.filter(p => 
      p.name.toLowerCase().includes(lowerCaseTerm) || 
      p.vendor.toLowerCase().includes(lowerCaseTerm)
    );
  }, [searchTerm]); // Se recalcula si el término de búsqueda cambia

  if (!searchTerm.trim()) {
    return (
      <div className="min-h-screen p-8 mt-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Ingrese un término de búsqueda 🔎</h1>
        <p className="text-gray-600">Utilice la barra de navegación para encontrar sus snacks favoritos.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 mt-20 min-h-screen"> 
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
            Resultados para: **"{searchTerm}"**
        </h1>
        <p className="text-lg text-gray-600">
            {filteredProducts.length} productos encontrados.
        </p>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product as any} /> 
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
            <p className="text-xl text-gray-600">
                ¡Lo sentimos! No encontramos productos que coincidan con **"{searchTerm}"** 😔.
            </p>
        </div>
      )}
    </div>
  );    
};

export default SearchResultsPage;