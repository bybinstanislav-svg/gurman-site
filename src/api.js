// ── АДРЕС СЕРВЕРА ЗАКАЗОВ ──
// Виртуальная машина Яндекс Клауд. По этому адресу заказы уходят
// и с сайта (гурман-супермаркет.рф), и из Android-приложения.
const APP_SERVER_URL = 'https://api.гурман-супермаркет.рф';

// Приоритет адреса:
// 1. Ручной override через localStorage ('gurman_api') — для тестов на локальной сети
// 2. APP_SERVER_URL — зашитый адрес для приложения
// 3. В разработке — localhost:3000
// 4. На сайте (прод) — тот же домен, где работает сервер
const API_BASE =
  (typeof window !== 'undefined' && window.localStorage.getItem('gurman_api'))?.replace(/\/+$/, '') ||
  APP_SERVER_URL ||
  (import.meta.env.DEV ? 'http://localhost:3000' : '');

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) {
    let message = `Ошибка сервера (${response.status})`;
    try {
      const data = await response.json();
      if (data.error) message = data.error;
    } catch { /* ответ без JSON */ }
    throw new Error(message);
  }
  return response.json();
}

export const api = {
  // Меню (грузится с сервера — цены обновляются без пересборки приложения)
  fetchMenu: () => request('/api/menu'),

  // Оформление заказа с сайта / из приложения
  createOrder: (order) =>
    request('/api/orders', { method: 'POST', body: JSON.stringify(order) }),

  // Активные заказы для экрана кухни
  fetchActiveOrders: () => request('/api/orders/active'),

  // Смена статуса: new | cooking | ready | completed
  updateOrderStatus: (orderId, status) =>
    request(`/api/orders/${orderId}`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Стоп-лист: [{ id, name }] позиций, которых нет в наличии
  fetchStops: () => request('/api/stops'),

  // Поставить/снять позицию со стопа
  setStopped: (productId, stopped, name) =>
    request(`/api/stops/${productId}`, { method: 'PUT', body: JSON.stringify({ stopped, name }) }),
};
