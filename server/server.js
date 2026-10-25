import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ORDERS_FILE = path.join(__dirname, 'orders.json');
const STOPS_FILE = path.join(__dirname, 'stops.json');
const DIST_DIR = path.join(__dirname, '..', 'dist');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- Хранение заказов: в файле, чтобы не терялись при перезапуске сервера ---
let orders = [];
let nextId = 1;

try {
  if (fs.existsSync(ORDERS_FILE)) {
    orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    nextId = orders.reduce((max, o) => Math.max(max, o.id), 0) + 1;
  }
} catch (err) {
  console.error('Не удалось прочитать orders.json, стартую с пустым списком:', err.message);
  orders = [];
}

const saveOrders = () => {
  fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), (err) => {
    if (err) console.error('Ошибка сохранения orders.json:', err.message);
  });
};

// --- Стоп-лист: позиции, которых нет в наличии [{ id, name }] ---
let stops = [];

try {
  if (fs.existsSync(STOPS_FILE)) {
    stops = JSON.parse(fs.readFileSync(STOPS_FILE, 'utf8'));
  }
} catch (err) {
  console.error('Не удалось прочитать stops.json:', err.message);
  stops = [];
}

const saveStops = () => {
  fs.writeFile(STOPS_FILE, JSON.stringify(stops, null, 2), (err) => {
    if (err) console.error('Ошибка сохранения stops.json:', err.message);
  });
};

// Допустимые статусы заказа и какое поле-время заполняется при переходе
const STATUSES = {
  new: null,
  cooking: 'startedAt',
  ready: 'readyAt',
  completed: 'completedAt',
};

// 1. Создание нового заказа (сюда отправляет данные сайт)
app.post('/api/orders', (req, res) => {
  const { customerName, phone, items, comment, orderType, address } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Корзина пуста' });
  }

  // заказы с позициями из стоп-листа не принимаем
  const stoppedIds = new Set(stops.map((s) => Number(s.id)));
  const stoppedInOrder = items.filter((item) => stoppedIds.has(Number(item.productId)));
  if (stoppedInOrder.length > 0) {
    const names = [...new Set(stoppedInOrder.map((i) => i.name))].join(', ');
    return res.status(409).json({ error: `Эти позиции сейчас недоступны: ${names}. Уберите их из корзины.` });
  }

  const normalizedItems = items.map((item) => ({
    productId: Number(item.productId) || null,
    name: String(item.name || 'Блюдо'),
    quantity: Math.max(1, parseInt(item.quantity) || 1),
    price: Number(item.price) || 0,
    variantLabel: item.variantLabel || null,
    addons: Array.isArray(item.addons)
      ? item.addons.map((a) => a.name).filter(Boolean)
      : [],
  }));

  const itemsTotal = normalizedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  // Доставка: 200 ₽ при заказе меньше 3000 ₽, от 3000 ₽ — бесплатно
  const type = orderType === 'delivery' ? 'delivery' : 'pickup';
  const deliveryFee = type === 'delivery' && itemsTotal < 3000 ? 200 : 0;
  const total = itemsTotal + deliveryFee;
  const now = new Date().toISOString();

  const newOrder = {
    id: nextId++,
    customerName: (customerName || '').trim() || 'Гость',
    phone: (phone || '').trim(),
    orderType: type,
    address: type === 'delivery' ? (address || '').trim() : '',
    comment: (comment || '').trim(),
    items: normalizedItems,
    itemsTotal,
    deliveryFee,
    total,
    status: 'new',
    createdAt: now,
    startedAt: null,
    readyAt: null,
    completedAt: null,
  };

  orders.push(newOrder);
  saveOrders();
  console.log(`📥 Новый заказ #${newOrder.id} (${newOrder.orderType === 'delivery' ? 'доставка' : 'самовывоз'}) на ${total} ₽`);
  res.status(201).json({ success: true, order: newOrder });
});

// 2. Активные заказы (отсюда экран кухни забирает данные)
app.get('/api/orders/active', (req, res) => {
  const activeOrders = orders
    .filter((o) => o.status !== 'completed')
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  res.json(activeOrders);
});

// 3. Изменение статуса заказа (кнопки на экране кухни)
app.patch('/api/orders/:id', (req, res) => {
  const orderId = parseInt(req.params.id);
  const { status } = req.body;

  if (!STATUSES.hasOwnProperty(status)) {
    return res.status(400).json({ error: 'Недопустимый статус' });
  }

  const order = orders.find((o) => o.id === orderId);
  if (!order) {
    return res.status(404).json({ error: 'Заказ не найден' });
  }

  order.status = status;
  // при возврате назад — очищаем все отметки времени после текущего статуса
  order.startedAt = ['cooking', 'ready', 'completed'].includes(status) ? (order.startedAt || new Date().toISOString()) : null;
  order.readyAt = ['ready', 'completed'].includes(status) ? (order.readyAt || new Date().toISOString()) : null;
  order.completedAt = status === 'completed' ? new Date().toISOString() : null;

  saveOrders();
  console.log(`🔄 Заказ #${orderId}: статус → ${status}`);
  res.json({ success: true, order });
});

// 4. Стоп-лист — позиции, которых нет в наличии
app.get('/api/stops', (req, res) => {
  res.json(stops);
});

app.put('/api/stops/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const { stopped, name } = req.body;

  if (!Number.isInteger(productId) || typeof stopped !== 'boolean') {
    return res.status(400).json({ error: 'Нужны id позиции и stopped (true/false)' });
  }

  const existing = stops.find((s) => Number(s.id) === productId);
  if (stopped && !existing) {
    stops.push({ id: productId, name: String(name || '').trim() || `Позиция #${productId}` });
  } else if (!stopped && existing) {
    stops = stops.filter((s) => Number(s.id) !== productId);
  }

  saveStops();
  console.log(`🚫 Стоп-лист: "${existing?.name || name || productId}" ${stopped ? 'остановлена' : 'в продаже'}`);
  res.json({ success: true, stops });
});

// Раздача собранного сайта (dist), если он есть — тогда экран кухни и сайт
// живут на одном сервере и обращаются к API без CORS
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api/')) {
      return res.sendFile(path.join(DIST_DIR, 'index.html'));
    }
    next();
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Сервер «Гурман» запущен на порту ${PORT}`);
});
