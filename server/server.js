import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ORDERS_FILE = path.join(__dirname, 'orders.json');
const STOPS_FILE = path.join(__dirname, 'stops.json');
const DIST_DIR = path.join(__dirname, '..', 'dist');
const MENU_FILE = path.join(__dirname, '..', 'src', 'menuData.js');

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
app.post('/api/orders', async (req, res) => {
  const { customerName, phone, items, comment, orderType, address } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Корзина пуста' });
  }

  // заказы с позициями из стоп-листа не принимаем
  const stoppedIds = new Set((await effectiveStops()).map((s) => Number(s.id)));
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

// 4. Меню для сайта и приложения (подгружается с сервера, чтобы менять цены
// без пересборки приложения). Файл перечитывается при каждом запросе —
// после `git pull` на сервере изменения видны сразу, без перезапуска.
app.get('/api/menu', async (req, res) => {
  try {
    const menuModule = await import(`${pathToFileURL(MENU_FILE).href}?t=${Date.now()}`);
    res.json({ products: menuModule.MENU_DATA, addons: menuModule.PIZZA_ADDONS, tv: menuModule.TV_DATA });
  } catch (err) {
    console.error('Ошибка чтения меню:', err.message);
    res.status(500).json({ error: 'Не удалось загрузить меню' });
  }
});

// 4b. Версия приложения для принудительного обновления.
// Файл server/app-version.json: minVersionCode — минимальная версия,
// ниже которой приложение требует обновления; updateUrl — ссылка на RuStore.
app.get('/api/app-version', (req, res) => {
  try {
    res.json(JSON.parse(fs.readFileSync(path.join(__dirname, 'app-version.json'), 'utf8')));
  } catch (err) {
    res.json({ minVersionCode: 0, force: false, updateUrl: '', note: '' });
  }
});

// 5. Стоп-лист — позиции, которых нет в наличии.
// Два слоя: ручные стопы (stops.json, ставит повар) + автостоп по времени МСК
// (всё на стопе после 19:00, снимается в 10:00). Итоговый список — их объединение.
let autoClosed = false;

const mskHour = () => (new Date().getUTCHours() + 3) % 24;
const computeAutoClosed = () => {
  if (process.env.GURMAN_FORCE_AUTOSTOP === 'on') return true;
  if (process.env.GURMAN_FORCE_AUTOSTOP === 'off') return false;
  const h = mskHour();
  return h >= 19 || h < 10;
};

// полный список позиций (для автостопа и массовых операций) — из menuData
let menuCache = { data: null, at: 0 };
async function getMenuData() {
  if (!menuCache.data || Date.now() - menuCache.at > 60000) {
    const mod = await import(`${pathToFileURL(MENU_FILE).href}?t=${Date.now()}`);
    menuCache = { data: { products: mod.MENU_DATA, addons: mod.PIZZA_ADDONS, tv: mod.TV_DATA || {} }, at: Date.now() };
  }
  return menuCache.data;
}

const effectiveStops = async () => {
  if (!autoClosed) return stops;
  const { products } = await getMenuData();
  return products.map((p) => ({ id: p.id, name: p.name }));
};

const refreshAutoClosed = async () => {
  const want = computeAutoClosed();
  if (want !== autoClosed) {
    autoClosed = want;
    console.log(`🌙 Автостоп ${autoClosed ? 'ВКЛЮЧЁН (закрыто до 10:00 МСК)' : 'выключен (принимаем заказы)'}`);
  }
};

app.get('/api/stops', async (req, res) => {
  await refreshAutoClosed();
  res.json({ autoClosed, resumesAt: '10:00', stops: await effectiveStops(), manual: stops });
});

// массовая установка: { stopped: true/false, category: 'pizza'|'fastfood'|'mangal'|'all' }
app.post('/api/stops/bulk', async (req, res) => {
  const { stopped, category } = req.body;
  if (typeof stopped !== 'boolean') {
    return res.status(400).json({ error: 'Нужен stopped (true/false)' });
  }
  const { products } = await getMenuData();
  const targets = category && category !== 'all'
    ? products.filter((p) => p.category === category)
    : products;

  if (stopped) {
    for (const p of targets) {
      if (!stops.find((s) => Number(s.id) === Number(p.id))) {
        stops.push({ id: p.id, name: p.name });
      }
    }
  } else {
    const ids = new Set(targets.map((p) => Number(p.id)));
    stops = stops.filter((s) => !ids.has(Number(s.id)));
  }

  saveStops();
  console.log(`🚫 Массовый стоп (${category || 'all'}): ${stopped ? 'на стоп' : 'в продажу'} — ${targets.length} позиций`);
  res.json({ success: true, autoClosed, stops: await effectiveStops(), manual: stops });
});

app.put('/api/stops/:id', async (req, res) => {
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
  res.json({ success: true, autoClosed, stops: await effectiveStops(), manual: stops });
});

// Раздача собранного сайта (dist), если он есть — тогда экран кухни и сайт
// живут на одном сервере и обращаются к API без CORS
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache');
      else if (/.(js|css)$/.test(filePath)) res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api/')) {
      res.setHeader('Cache-Control', 'no-cache');
      return res.sendFile(path.join(DIST_DIR, 'index.html'));
    }
    next();
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Сервер «Гурман» запущен на порту ${PORT}`);
  refreshAutoClosed();
  setInterval(refreshAutoClosed, 30000);
});
