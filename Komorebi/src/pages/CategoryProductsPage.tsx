import React, { useMemo, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ProductCard from '../components/homepage/ProductCard'; 
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts, selectAllProducts, selectProductsLoading } from '../store/slices/productSlice';
import type { Product } from '../data/ProductTypes';

const CategoryProductsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Obtenemos los parámetros de ambas rutas: /categories/:categoryId y /search/:searchTerm
  const { categoryId, searchTerm: encodedSearchTerm } = useParams<{ categoryId?: string, searchTerm?: string }>();
  // Usamos useLocation para forzar un re-render si la ruta cambia
  const location = useLocation();

  // Redux selectors
  const productsArray = useAppSelector(selectAllProducts);
  const loading = useAppSelector(selectProductsLoading);

  // Fetch products when component mounts
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Decodificamos el término de búsqueda, si existe
  const searchTerm = encodedSearchTerm ? decodeURIComponent(encodedSearchTerm.replace(/\+/g, ' ')) : undefined; 

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

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen p-8 mt-20 text-center">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--komorebi-yellow)]"></div>
        </div>
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

      <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))] max-w-[1200px] mx-auto">
        {products.map(product => (
          <ProductCard key={product.id} product={product} /> 
        ))}
      </div>
    </div>
  );    
};

export default CategoryProductsPage;