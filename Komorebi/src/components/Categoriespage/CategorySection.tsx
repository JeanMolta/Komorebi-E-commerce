import React from 'react';
import CategoryCard from './CategoryCard'; 

const categoriesData = [
  { id: 'cakes', name: 'Cakes', image: '/images/categories/categories_01.jpg' },
  { id: 'healthy', name: 'Healthy', image: '/images/categories/categories_02.jpg' },
  { id: 'shakes', name: 'Shakes', image: '/images/categories/categories_03.jpg' },
  { id: 'sweettreats', name: 'Sweet Treats', image: '/images/products/prod_005.jpg' },
  { id: 'donuts', name: 'Donuts', image: '/images/categories/categories_04.jpg' },
  { id: 'onigiris', name: 'Onigiris', image: '/images/categories/categories_05.jpg' },
];

const CategorySection: React.FC = () => {
  return (
    <section className="p-4 md:p-8 mt-16">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Categories</h2>
        <p className="text-md text-gray-500">Discover awesome products!</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {categoriesData.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;