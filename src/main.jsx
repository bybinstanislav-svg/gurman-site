import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import TvMenu from './TvMenu.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Главная страница вашего сайта (интернет-магазин) */}
        <Route path="/" element={<App />} />
        
        {/* Страница для 5 телевизоров */}
        <Route path="/tv" element={<TvMenu />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)

// Регистрация Service Worker только для продакшна (в интернете), чтобы он не мешал локальной разработке
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('ServiceWorker зарегистрирован успешно: ', registration.scope);
      })
      .catch((error) => {
        console.log('Ошибка регистрации ServiceWorker: ', error);
      });
  });
}