import React from 'react';
import './Cart.css';

function Cart({ cart, totalPrice, onUpdateQuantity, onRemoveItem, onClearCart, onClose }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleCheckout = () => {
    alert('Это учебный проект. Реальная оплата не реализована. Спасибо за покупку! 🎉');
    onClearCart();
    onClose();
  };

  return (
    <>
      <div className="cart-overlay" onClick={onClose}></div>
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2>Корзина</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <div className="cart-content">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h3>Корзина пуста</h3>
              <p>Добавьте товары, чтобы продолжить покупки</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <img
                      src={item.product?.image}
                      alt={item.product?.name}
                      className="cart-item-image"
                    />
                    
                    <div className="cart-item-info">
                      <h4 className="cart-item-name">{item.product?.name}</h4>
                      <p className="cart-item-price">
                        {formatPrice(item.product?.price || 0)}
                      </p>
                      
                      <div className="cart-item-controls">
                        <div className="quantity-controls">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="quantity-btn"
                          >
                            −
                          </button>
                          <span className="quantity-value">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= (item.product?.stock || 0)}
                            className="quantity-btn"
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="remove-btn"
                          title="Удалить"
                        >
                          🗑️
                        </button>
                      </div>
                      
                      <div className="cart-item-total">
                        Итого: {formatPrice((item.product?.price || 0) * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-total">
                  <span className="cart-total-label">Общая сумма:</span>
                  <span className="cart-total-value">{formatPrice(totalPrice)}</span>
                </div>
                
                <button onClick={handleCheckout} className="checkout-btn">
                  Оформить заказ
                </button>
                
                <button onClick={onClearCart} className="clear-cart-btn">
                  Очистить корзину
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Cart;
