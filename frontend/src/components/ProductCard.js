import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

function ProductCard({ product, onAddToCart }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    onAddToCart(product);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image-container">
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
          <div className="product-category-badge">
            {product.category}
          </div>
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          
          <div className="product-footer">
            <div className="product-price">
              {formatPrice(product.price)}
            </div>
            
            {product.stock > 0 ? (
              <div className="product-stock in-stock">
                В наличии: {product.stock}
              </div>
            ) : (
              <div className="product-stock out-of-stock">
                Нет в наличии
              </div>
            )}
          </div>
        </div>
      </Link>
      
      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        className="add-to-cart-btn"
      >
        {product.stock > 0 ? '🛒 В корзину' : 'Недоступно'}
      </button>
    </div>
  );
}

export default ProductCard;
