const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Обработка ошибок
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Ошибка сервера' }));
    throw new Error(error.error || 'Произошла ошибка');
  }
  return response.json();
};

// ========== Products API ==========

export const getProducts = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.category) params.append('category', filters.category);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.order) params.append('order', filters.order);
  
  const response = await fetch(`${API_URL}/products?${params}`);
  return handleResponse(response);
};

export const getProduct = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`);
  return handleResponse(response);
};

export const createProduct = async (productData) => {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
  return handleResponse(response);
};

export const updateProduct = async (id, productData) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
  return handleResponse(response);
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE'
  });
  return handleResponse(response);
};

export const getCategories = async () => {
  const response = await fetch(`${API_URL}/categories`);
  return handleResponse(response);
};

// ========== Cart API ==========

export const getCart = async () => {
  const response = await fetch(`${API_URL}/cart`);
  return handleResponse(response);
};

export const addToCart = async (productId, quantity) => {
  const response = await fetch(`${API_URL}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity })
  });
  return handleResponse(response);
};

export const updateCartItem = async (cartItemId, quantity) => {
  const response = await fetch(`${API_URL}/cart/${cartItemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity })
  });
  return handleResponse(response);
};

export const removeFromCart = async (cartItemId) => {
  const response = await fetch(`${API_URL}/cart/${cartItemId}`, {
    method: 'DELETE'
  });
  return handleResponse(response);
};

export const clearCart = async () => {
  const response = await fetch(`${API_URL}/cart`, {
    method: 'DELETE'
  });
  return handleResponse(response);
};
