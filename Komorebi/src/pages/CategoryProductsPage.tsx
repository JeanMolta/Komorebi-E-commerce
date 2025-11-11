import React, { useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
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

const CategoryProductsPage: React.FC = () => {
  // Obtenemos los parámetros de ambas rutas: /categories/:categoryId y /search/:searchTerm
  const { categoryId, searchTerm: encodedSearchTerm } = useParams<{ categoryId?: string, searchTerm?: string }>();
  // Usamos useLocation para forzar un re-render si la ruta cambia
  const location = useLocation();

  // Decodificamos el término de búsqueda, si existe
  const searchTerm = encodedSearchTerm ? decodeURIComponent(encodedSearchTerm.replace(/\+/g, ' ')) : undefined;

  const productsArray: Product[] = productsData as Product[]; 

  const products: Product[] = useMemo(() => {
    // Lógica para FILTRAR
    if (categoryId) {
      // 1. FILTRADO POR CATEGORÍA (funcionalidad original)
      return productsArray.filter(p => p.category.toLowerCase() === categoryId.toLowerCase());
    } 
    
    if (searchTerm) {
      // 2. FILTRADO POR TÉRMINO DE BÚSQUEDA (nueva funcionalidad)
      const termLower = searchTerm.toLowerCase();
      return productsArray.filter(p => 
        // Busca coincidencias en el nombre, el vendedor o la categoría del producto
        p.name.toLowerCase().includes(termLower) ||
        p.vendor.toLowerCase().includes(termLower) ||
        p.category.toLowerCase().includes(termLower)
      );
    }

    // Si no hay categoría ni término de búsqueda (debería ser raro, pero por seguridad)
    return [];
  }, [categoryId, searchTerm, location.pathname]); // Aseguramos re-render si la ruta cambia

  // Determinar el título de la página
  const pageTitle = useMemo(() => {
    if (searchTerm) {
      return `Resultados para: "${searchTerm}"`;
    }
    if (categoryId) {
      return categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace('-', ' ');
    }
    return 'Productos';
  }, [categoryId, searchTerm]);

  // Si no se encontró ningún criterio de filtrado (ni categoría ni término de búsqueda)
  if (!categoryId && !searchTerm) {
     return (
        <div className="min-h-screen p-8 mt-20 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Parámetros no encontrados 😔</h1>
            <p className="text-gray-600">No se especificó ninguna categoría o término de búsqueda.</p>
        </div>
    );
  }

  // Si no se encuentran productos
  if (products.length === 0) {
    return (
      <div className="min-h-screen p-8 mt-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">No products were found 😔</h1>
        <p className="text-gray-600">No products are available for "{pageTitle}".</p>
      </div>
    );
  }

  // Renderizar los productos encontrados
  return (
    <div className="p-4 md:p-8 mt-20 min-h-screen"> 
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
        <p className="text-lg text-gray-600">Explore our delicious products.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product as any} /> 
        ))}
      </div>
    </div>
  );    
};

export default CategoryProductsPage;