import React from 'react';
import { useNavigate } from 'react-router-dom';

// Define el tipo para la data de la categoría
interface Category {
  id: string;
  name: string;
  image: string; 
}

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const navigate = useNavigate();
  
  // URL de la imagen de la categoría
  const imageUrl = category.image;
  // Fallback opcional por si la imagen no carga
  const fallback = '/images/categories/placeholder.jpg'; 

  const handleCardClick = () => {
    navigate(`/categories/${category.id}`);
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col transition-transform transform hover:-translate-y-1 cursor-pointer w-full"
      onClick={handleCardClick}
    >
      <div className="relative w-full pt-[100%]"> 
        <img
          src={imageUrl}
          alt={category.name}
          loading="lazy"
          onError={(e) => ((e.target as HTMLImageElement).src = fallback)}
          className="absolute inset-0 w-full h-full object-cover rounded-t-2xl"
        />
      </div>

      <div className="p-4 flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold text-gray-800 text-center">{category.name}</h3>
      </div>
    </div>
  );
};

export default CategoryCard;