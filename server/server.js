import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Временная память для заказов (позже заменим на базу данных)
let orders = [];
let nextId = 1;

// 1. Эндпоинт для создания нового заказа (сюда отправляет данные сайт клиента)
app.post('/api/orders', (req, res) => {
  const { customerName, phone, items } = req.body;
  
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Корзина пуста' });
  }

  const newOrder = {
    id: nextId++,
    customerName: customerName || 'Гость',
    phone: phone || 'Не указан',
    items,
    status: 'new', // new, cooking, ready
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);
  console.log(`📥 Новый заказ #${newOrder.id} получен!`);
  res.status(201).json({ success: true, order: newOrder });
});

// 2. Эндпоинт для получения активных заказов (отсюда планшет повара забирает данные)
app.get('/api/orders/active', (req, res) => {
  // Возвращаем заказы, которые еще не завершены
  const activeOrders = orders.filter(o => o.status !== 'completed');
  res.json(activeOrders);
});

// 3. Эндпоинт для изменения статуса заказа поваром (кнопки "Готовить" / "Готов")
app.patch('/api/orders/:id', (req, res) => {
  const orderId = parseInt(req.params.id);
  const { status } = req.body;

  const order = orders.find(o => o.id === orderId);
  if (!order) {
    return res.status(404).json({ error: 'Заказ не найден' });
  }

  order.status = status;
  console.log(`🔄 Статус заказа #${orderId} изменен на: ${status}`);
  res.json({ success: true, order });
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер «Гурман» запущен на порту ${PORT}`);
});