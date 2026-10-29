import React, { useState, useEffect } from 'react';

export default function KitchenPanel() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/orders/active');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    await fetch(`http://localhost:3000/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchOrders();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      <h1 style={{ color: '#333' }}>👨‍🍳 Кухня — Терминал повара</h1>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
        {orders.length === 0 ? (
          <p style={{ fontSize: '18px', color: '#666' }}>Новых заказов пока нет...</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} style={{
              background: '#fff', 
              border: '2px solid #ddd', 
              borderRadius: '10px', 
              padding: '20px', 
              width: '320px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#d9534f' }}>Заказ №{order.id}</h3>
              <p style={{ margin: '5px 0', color: '#555' }}><b>Клиент:</b> {order.customerName}</p>
              <p style={{ margin: '5px 0', color: '#555' }}><b>Телефон:</b> {order.phone}</p>
              
              <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '10px 0' }} />
              
              <h4 style={{ margin: '0 0 5px 0' }}>Состав заказа:</h4>
              <ul style={{ paddingLeft: '20px', margin: '0 0 15px 0' }}>
                {order.items.map((item, index) => (
                  <li key={index} style={{ fontSize: '16px', marginBottom: '4px' }}>
                    {item.name} — <b>{item.quantity} шт.</b>
                  </li>
                ))}
              </ul>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => updateStatus(order.id, 'cooking')}
                  style={{ flex: 1, padding: '10px', background: '#f0ad4e', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Готовить
                </button>
                <button 
                  onClick={() => updateStatus(order.id, 'ready')}
                  style={{ flex: 1, padding: '10px', background: '#5cb85c', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Готов
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}