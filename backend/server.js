require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { body, param, validationResult } = require('express-validator');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Обработка ошибок валидации
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ========== ROUTES для товаров ==========

// Получить все товары с фильтрацией, поиском и сортировкой
app.get('/api/products', async (req, res) => {
  try {
    const { search, category, sortBy, order } = req.query;
    
    let where = {};
    
    // Поиск по названию
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive'
      };
    }
    
    // Фильтрация по категории
    if (category && category !== 'all') {
      where.category = category;
    }
    
    // Сортировка
    let orderBy = {};
    if (sortBy === 'price') {
      orderBy.price = order === 'desc' ? 'desc' : 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }
    
    const products = await prisma.product.findMany({
      where,
      orderBy
    });
    
    res.json(products);
  } catch (error) {
    console.error('Ошибка получения товаров:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении товаров' });
  }
});

// Получить все категории
app.get('/api/categories', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category']
    });
    
    const categories = products.map(p => p.category);
    res.json(categories);
  } catch (error) {
    console.error('Ошибка получения категорий:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении категорий' });
  }
});

// Получить товар по ID
app.get('/api/products/:id', 
  param('id').isInt().withMessage('ID должен быть числом'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      
      const product = await prisma.product.findUnique({
        where: { id: productId }
      });
      
      if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
      }
      
      res.json(product);
    } catch (error) {
      console.error('Ошибка получения товара:', error);
      res.status(500).json({ error: 'Ошибка сервера при получении товара' });
    }
  }
);

// Создать товар
app.post('/api/products',
  body('name').trim().notEmpty().withMessage('Название обязательно'),
  body('description').trim().notEmpty().withMessage('Описание обязательно'),
  body('price').isFloat({ min: 0 }).withMessage('Цена должна быть положительным числом'),
  body('category').trim().notEmpty().withMessage('Категория обязательна'),
  body('image').trim().notEmpty().withMessage('URL изображения обязателен'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Количество должно быть неотрицательным'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { name, description, price, category, image, stock } = req.body;
      
      const product = await prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          category,
          image,
          stock: stock ? parseInt(stock) : 10
        }
      });
      
      res.status(201).json(product);
    } catch (error) {
      console.error('Ошибка создания товара:', error);
      res.status(500).json({ error: 'Ошибка сервера при создании товара' });
    }
  }
);

// Обновить товар
app.put('/api/products/:id',
  param('id').isInt().withMessage('ID должен быть числом'),
  body('name').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
  body('price').optional().isFloat({ min: 0 }),
  body('category').optional().trim().notEmpty(),
  body('image').optional().trim().notEmpty(),
  body('stock').optional().isInt({ min: 0 }),
  handleValidationErrors,
  async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const updateData = {};
      
      if (req.body.name) updateData.name = req.body.name;
      if (req.body.description) updateData.description = req.body.description;
      if (req.body.price !== undefined) updateData.price = parseFloat(req.body.price);
      if (req.body.category) updateData.category = req.body.category;
      if (req.body.image) updateData.image = req.body.image;
      if (req.body.stock !== undefined) updateData.stock = parseInt(req.body.stock);
      
      const product = await prisma.product.update({
        where: { id: productId },
        data: updateData
      });
      
      res.json(product);
    } catch (error) {
      console.error('Ошибка обновления товара:', error);
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Товар не найден' });
      }
      res.status(500).json({ error: 'Ошибка сервера при обновлении товара' });
    }
  }
);

// Удалить товар
app.delete('/api/products/:id',
  param('id').isInt().withMessage('ID должен быть числом'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      
      await prisma.product.delete({
        where: { id: productId }
      });
      
      res.json({ message: 'Товар успешно удален' });
    } catch (error) {
      console.error('Ошибка удаления товара:', error);
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Товар не найден' });
      }
      res.status(500).json({ error: 'Ошибка сервера при удалении товара' });
    }
  }
);

// ========== ROUTES для корзины ==========

// Получить все элементы корзины
app.get('/api/cart', async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      include: {
        product: true
      }
    });
    
    // Форматируем данные для фронтенда
    const formattedItems = await Promise.all(
      cartItems.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        });
        
        return {
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          product: product
        };
      })
    );
    
    res.json(formattedItems);
  } catch (error) {
    console.error('Ошибка получения корзины:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении корзины' });
  }
});

// Добавить товар в корзину
app.post('/api/cart',
  body('productId').isInt({ min: 1 }).withMessage('ID товара должен быть положительным числом'),
  body('quantity').isInt({ min: 1 }).withMessage('Количество должно быть положительным числом'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      
      // Проверяем существование товара
      const product = await prisma.product.findUnique({
        where: { id: parseInt(productId) }
      });
      
      if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
      }
      
      // Проверяем наличие на складе
      if (product.stock < quantity) {
        return res.status(400).json({ error: 'Недостаточно товара на складе' });
      }
      
      // Проверяем, есть ли товар уже в корзине
      const existingItem = await prisma.cartItem.findFirst({
        where: { productId: parseInt(productId) }
      });
      
      let cartItem;
      
      if (existingItem) {
        // Обновляем количество
        cartItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + parseInt(quantity) }
        });
      } else {
        // Создаем новый элемент корзины
        cartItem = await prisma.cartItem.create({
          data: {
            productId: parseInt(productId),
            quantity: parseInt(quantity)
          }
        });
      }
      
      res.status(201).json(cartItem);
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error);
      res.status(500).json({ error: 'Ошибка сервера при добавлении в корзину' });
    }
  }
);

// Обновить количество товара в корзине
app.put('/api/cart/:id',
  param('id').isInt().withMessage('ID должен быть числом'),
  body('quantity').isInt({ min: 1 }).withMessage('Количество должно быть положительным числом'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const cartItemId = parseInt(req.params.id);
      const { quantity } = req.body;
      
      const cartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId }
      });
      
      if (!cartItem) {
        return res.status(404).json({ error: 'Элемент корзины не найден' });
      }
      
      // Проверяем наличие на складе
      const product = await prisma.product.findUnique({
        where: { id: cartItem.productId }
      });
      
      if (product.stock < quantity) {
        return res.status(400).json({ error: 'Недостаточно товара на складе' });
      }
      
      const updatedItem = await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity: parseInt(quantity) }
      });
      
      res.json(updatedItem);
    } catch (error) {
      console.error('Ошибка обновления корзины:', error);
      res.status(500).json({ error: 'Ошибка сервера при обновлении корзины' });
    }
  }
);

// Удалить товар из корзины
app.delete('/api/cart/:id',
  param('id').isInt().withMessage('ID должен быть числом'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const cartItemId = parseInt(req.params.id);
      
      await prisma.cartItem.delete({
        where: { id: cartItemId }
      });
      
      res.json({ message: 'Товар удален из корзины' });
    } catch (error) {
      console.error('Ошибка удаления из корзины:', error);
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Элемент корзины не найден' });
      }
      res.status(500).json({ error: 'Ошибка сервера при удалении из корзины' });
    }
  }
);

// Очистить всю корзину
app.delete('/api/cart', async (req, res) => {
  try {
    await prisma.cartItem.deleteMany();
    res.json({ message: 'Корзина очищена' });
  } catch (error) {
    console.error('Ошибка очистки корзины:', error);
    res.status(500).json({ error: 'Ошибка сервера при очистке корзины' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Сервер работает' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
  console.log(`🌐 API доступен по адресу: http://localhost:${PORT}/api`);
});

// Обработка завершения
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
