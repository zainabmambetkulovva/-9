import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import ProductDetail from './components/ProductDetail';
import * as api from './services/api';

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCart, setShowCart] = useState(false);

  // Фильтры
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');

  // Загрузка данных при монтировании
  useEffect(() => {
    loadInitialData();
  }, []);

  // Загрузка товаров и категорий
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData, cartData] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getCart()
      ]);
      
      setProducts(productsData);
      setFilteredProducts(productsData);
      setCategories(categoriesData);
      setCart(cartData);
      setError(null);
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
      setError('Не удалось загрузить данные. Проверьте подключение к серверу.');
    } finally {
      setLoading(false);
    }
  };

  // Применение фильтров и сортировки
  useEffect(() => {
    let result = [...products];

    // Поиск
    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Фильтрация по категории
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Сортировка
    if (sortOrder === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, sortOrder, products]);

  // Добавление в корзину
  const handleAddToCart = async (product) => {
    try {
      // Проверяем, есть ли товар уже в корзине
      const existingItem = cart.find(item => item.productId === product.id);
      
      if (existingItem) {
        // Обновляем количество
        await api.updateCartItem(existingItem.id, existingItem.quantity + 1);
      } else {
        // Добавляем новый товар
        await api.addToCart(product.id, 1);
      }
      
      // Обновляем корзину
      const updatedCart = await api.getCart();
      setCart(updatedCart);
      
      // Показываем уведомление (можно добавить toast notification)
      alert('Товар добавлен в корзину!');
    } catch (err) {
      console.error('Ошибка добавления в корзину:', err);
      alert('Не удалось добавить товар в корзину');
    }
  };

  // Обновление количества в корзине
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await api.updateCartItem(itemId, newQuantity);
      const updatedCart = await api.getCart();
      setCart(updatedCart);
    } catch (err) {
      console.error('Ошибка обновления количества:', err);
      alert('Не удалось обновить количество');
    }
  };

  // Удаление из корзины
  const handleRemoveFromCart = async (itemId) => {
    try {
      await api.removeFromCart(itemId);
      const updatedCart = await api.getCart();
      setCart(updatedCart);
    } catch (err) {
      console.error('Ошибка удаления из корзины:', err);
      alert('Не удалось удалить товар из корзины');
    }
  };

  // Очистка корзины
  const handleClearCart = async () => {
    try {
      await api.clearCart();
      setCart([]);
    } catch (err) {
      console.error('Ошибка очистки корзины:', err);
      alert('Не удалось очистить корзину');
    }
  };

  // Подсчет количества товаров в корзине
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Подсчет общей стоимости
  const totalPrice = cart.reduce((total, item) => {
    return total + (item.product?.price || 0) * item.quantity;
  }, 0);

  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка данных...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error-container">
          <h2>Ошибка</h2>
          <p>{error}</p>
          <button onClick={loadInitialData} className="btn btn-primary">
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Header 
          cartItemsCount={cartItemsCount}
          onCartClick={() => setShowCart(!showCart)}
        />
        
        <Routes>
          <Route path="/" element={
            <main className="main-content">
              <div className="container">
                <FilterBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  categories={categories}
                  sortOrder={sortOrder}
                  onSortChange={setSortOrder}
                />
                
                <ProductList
                  products={filteredProducts}
                  onAddToCart={handleAddToCart}
                />
              </div>
            </main>
          } />
          
          <Route path="/product/:id" element={
            <ProductDetail onAddToCart={handleAddToCart} />
          } />
        </Routes>

        {showCart && (
          <Cart
            cart={cart}
            totalPrice={totalPrice}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onClose={() => setShowCart(false)}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
