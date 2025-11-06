import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
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
  const { categoryId } = useParams<{ categoryId: string }>();

  const productsArray: Product[] = productsData as Product[]; 

  const products: Product[] = useMemo(() => {
    return productsArray.filter(p => p.category.toLowerCase() === categoryId?.toLowerCase());
  }, [categoryId]);

  const categoryName = categoryId
    ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace('-', ' ')
    : 'Productos';

  if (!categoryId || products.length === 0) {
    return (
      <div className="min-h-screen p-8 mt-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">No se encontraron productos 😔</h1>
        <p className="text-gray-600">No hay productos disponibles en la categoría **{categoryName}**.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 mt-20 min-h-screen"> 
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
        <p className="text-lg text-gray-600">Explora todos nuestros deliciosos productos.</p>
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