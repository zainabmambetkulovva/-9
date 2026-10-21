const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const products = [
  {
    name: 'Беспроводные наушники Sony WH-1000XM5',
    description: 'Премиальные наушники с активным шумоподавлением, до 30 часов работы',
    price: 29990,
    category: 'Электроника',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400',
    stock: 15
  },
  {
    name: 'Смартфон Samsung Galaxy S24',
    description: 'Флагманский смартфон с 6.2" экраном, 8GB RAM, 256GB памяти',
    price: 79990,
    category: 'Электроника',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    stock: 8
  },
  {
    name: 'Ноутбук Apple MacBook Air M2',
    description: 'Тонкий и легкий ноутбук с чипом M2, 13.6" Liquid Retina дисплей',
    price: 119990,
    category: 'Электроника',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    stock: 5
  },
  {
    name: 'Умные часы Apple Watch Series 9',
    description: 'GPS, Always-On Retina дисплей, водонепроницаемые, мониторинг здоровья',
    price: 39990,
    category: 'Электроника',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400',
    stock: 12
  },
  {
    name: 'Кофемашина De\'Longhi Magnifica',
    description: 'Автоматическая кофемашина с капучинатором, 15 бар',
    price: 49990,
    category: 'Бытовая техника',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400',
    stock: 7
  },
  {
    name: 'Робот-пылесос Xiaomi Robot Vacuum S10',
    description: 'Умная навигация, влажная уборка, автоматическая очистка контейнера',
    price: 34990,
    category: 'Бытовая техника',
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400',
    stock: 10
  },
  {
    name: 'Кроссовки Nike Air Max 270',
    description: 'Стильные спортивные кроссовки с амортизацией Air, размеры 40-45',
    price: 12990,
    category: 'Одежда и обувь',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    stock: 20
  },
  {
    name: 'Куртка The North Face ThermoBall',
    description: 'Легкая и теплая куртка с синтетическим утеплителем',
    price: 18990,
    category: 'Одежда и обувь',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    stock: 14
  },
  {
    name: 'Рюкзак Herschel Little America',
    description: 'Вместительный рюкзак для ноутбука до 15", классический дизайн',
    price: 8990,
    category: 'Аксессуары',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    stock: 18
  },
  {
    name: 'Солнцезащитные очки Ray-Ban Aviator',
    description: 'Классические очки-авиаторы с поляризованными линзами',
    price: 14990,
    category: 'Аксессуары',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400',
    stock: 25
  },
  {
    name: 'Настольная лампа Xiaomi Mi Smart LED',
    description: 'Умная настольная лампа с регулировкой яркости и температуры света',
    price: 3990,
    category: 'Дом и интерьер',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
    stock: 30
  },
  {
    name: 'Увлажнитель воздуха Dyson Pure Humidify+Cool',
    description: 'Увлажнитель, очиститель и вентилятор 3 в 1 с технологией UV-C',
    price: 54990,
    category: 'Дом и интерьер',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400',
    stock: 6
  },
  {
    name: 'Игровая консоль PlayStation 5',
    description: 'Консоль нового поколения с 825GB SSD, поддержка 4K и Ray Tracing',
    price: 54990,
    category: 'Электроника',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400',
    stock: 4
  },
  {
    name: 'Электросамокат Xiaomi Mi Electric Scooter 3',
    description: 'Складной электросамокат, до 30 км на одном заряде, максимальная скорость 25 км/ч',
    price: 29990,
    category: 'Транспорт',
    image: 'https://images.unsplash.com/photo-1559311320-f4a9ba1d671a?w=400',
    stock: 9
  },
  {
    name: 'Механическая клавиатура Keychron K2',
    description: 'Беспроводная механическая клавиатура с RGB подсветкой, переключатели Brown',
    price: 9990,
    category: 'Электроника',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
    stock: 16
  }
];

async function main() {
  console.log('Начинаю заполнение базы данных...');

  // Очистка существующих данных
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();

  // Добавление товаров
  for (const product of products) {
    await prisma.product.create({
      data: product
    });
  }

  console.log(`Добавлено ${products.length} товаров`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
