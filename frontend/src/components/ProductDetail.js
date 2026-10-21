import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import './ProductDetail.css';

function ProductDetail({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await api.getProduct(id);
      setProduct(data);
      setError(null);
    } catch (err) {
      console.error('Ошибка загрузки товара:', err);
      setError('Не удалось загрузить информацию о товаре');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product);
    alert(`${product.name} добавлен в корзину!`);
  };

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-container">
        <div className="error-container">
          <h2>Ошибка</h2>
          <p>{error || 'Товар не найден'}</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Вернуться к каталогу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <div className="container">
        <button onClick={() => navigate('/')} className="back-btn">
          ← Назад к каталогу
        </button>

        <div className="product-detail">
          <div className="product-detail-image-container">
            <img
              src={product.image}
              alt={product.name}
              className="product-detail-image"
            />
            <div className="product-detail-category-badge">
              {product.category}
            </div>
          </div>

          <div className="product-detail-info">
            <h1 className="product-detail-title">{product.name}</h1>

            <div className="product-detail-price">
              {formatPrice(product.price)}
            </div>

            <div className="product-detail-stock">
              {product.stock > 0 ? (
                <span className="stock-badge in-stock">
                  ✓ В наличии: {product.stock} шт.
                </span>
              ) : (
                <span className="stock-badge out-of-stock">
                  ✗ Нет в наличии
                </span>
              )}
            </div>

            <div className="product-detail-description">
              <h3>Описание</h3>
              <p>{product.description}</p>
            </div>

            {product.stock > 0 && (
              <div className="product-detail-actions">
                <div className="quantity-selector">
                  <label>Количество:</label>
                  <div className="quantity-controls-large">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="quantity-btn-large"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      min="1"
                      max={product.stock}
                      className="quantity-input"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="quantity-btn-large"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="add-to-cart-btn-large"
                >
                  🛒 Добавить в корзину
                </button>
              </div>
            )}

            <div className="product-detail-meta">
              <div className="meta-item">
                <span className="meta-label">Артикул:</span>
                <span className="meta-value">#{product.id}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Категория:</span>
                <span className="meta-value">{product.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
