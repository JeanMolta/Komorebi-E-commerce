import React from 'react';
import type { Product } from '../data/ProductTypes';

interface ProductCardProps {
  product: Product;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price);
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrl = 'https://via.placeholder.com/300x200?text=' + product.name.split(' ')[0];

  return (
    <div style={styles.card}>
      <img src={imageUrl} alt={product.name} style={styles.image} />
      <div style={styles.content}>
        <h3 style={styles.name}>{product.name}</h3>
        <p style={styles.vendor}>{product.vendor}</p>
        <p style={styles.price}>{formatPrice(product.price)}</p>
        <button style={styles.button} onClick={() => alert(`Añadido: ${product.name}`)}>
          Add to Cart 🛒
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    border: '1px solid #eee',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden', 
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s',
  },

  image: {
    width: '100%',
    height: 'auto',
    objectFit: 'cover', 
    aspectRatio: '3 / 2', 
    borderBottom: '1px solid #eee',
  },

  content: {
    padding: '16px',
    flexGrow: 1, 
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  name: {
    fontSize: '18px',
    margin: '0 0 4px 0',
    fontWeight: 'bold',
  },

  vendor: {
    fontSize: '14px',
    color: '#555',
    margin: '0 0 8px 0',
  },

  price: {
    fontSize: '20px',
    color: '#0070f3',
    fontWeight: 'bolder',
    margin: '8px 0 16px 0',
  },
  
  button: {
    backgroundColor: '#388e3c', 
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background-color 0.3s',
  }
};

export default ProductCard;