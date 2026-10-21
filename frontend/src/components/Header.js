import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header({ cartItemsCount, onCartClick }) {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>🛒 Mini E-commerce</h1>
          </Link>
          
          <nav className="nav">
            <button onClick={onCartClick} className="cart-button">
              <span className="cart-icon">🛍️</span>
              <span className="cart-text">Корзина</span>
              {cartItemsCount > 0 && (
                <span className="cart-badge">{cartItemsCount}</span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
