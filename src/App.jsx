import React, { useState, useMemo, useEffect } from 'react';
import { Phone, Clock, MapPin, ShoppingCart, X, Minus, Plus, Trash2, Check } from 'lucide-react';
import { api } from './api';

import { MENU_DATA, PIZZA_ADDONS } from './menuData';

// Витрина видео (рилсы) для всех вкладок
const REELS_DATA = [
  {
    id: 1,
    title: 'Сочный шашлык на углях',
    videoUrl: 'mangal12.mp4',
    tag: 'Мангал'
  },
  {
    id: 2,
    title: 'Завораживает',
    videoUrl: 'video-pizza.mp4',
    tag: 'Пицца'
  },
  {
    id: 3,
    title: 'Как проходит сборка шаурмы',
    videoUrl: 'stol-shaurma.mp4',
    tag: 'Фаст Фуд'
  }
];

// Лента вертикальных видео (рилсы)
const ReelsSection = () => {
  return (
    <div className="mb-6 overflow-x-auto scrollbar-hide py-2">
      <div className="flex space-x-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {REELS_DATA.map((reel) => (
          <div key={reel.id} className="flex-shrink-0 w-[180px] sm:w-[200px] rounded-2xl overflow-hidden shadow-lg bg-black relative aspect-[9/16] group">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              preload="auto"
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
            >
              <source src={reel.videoUrl} type="video/mp4" />
              Ваш браузер не поддерживает видео.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-between p-3 pointer-events-none">
              <span className="bg-[#FF6900] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider w-max">
                {reel.tag}
              </span>
              <h4 className="text-white text-xs sm:text-sm font-bold leading-tight">
                {reel.title}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CATEGORIES = [
  { id: 'pizza', label: 'Пицца' },
  { id: 'fastfood', label: 'Фаст Фуд' },
  { id: 'mangal', label: 'Мангал' },
  /*
  { id: 'bakery', label: 'Выпечка'},
  { id: 'hot', label: 'Горячие блюда' },
  { id: 'salads', label: 'Салаты' },
  { id: 'garnish', label: 'Гарниры' }*/
];

// Компонент Хедера (шапка сайта)
const Header = ({ cartItems, onOpenCart }) => {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Логотип */}
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="bg-[#FF6900] text-white p-2 rounded-lg font-bold text-xl tracking-wider">
              ГУРМАН
            </div>
          </div>

          {/* Контакты (скрыты на мобильных) */}
          <div className="hidden md:flex flex-col items-center text-sm">
            <div className="flex items-center text-gray-800 font-bold text-lg">
              <Phone className="w-4 h-4 mr-2 text-[#FF6900]" />
              <div className="flex flex-col items-center ...">
               <span>8 962 401-02-10</span>
               <span>910-210</span>
             </div>
            </div>
          </div>

          {/* Кнопка Корзины */}
          <button 
            onClick={onOpenCart}
            className="bg-[#FF6900] hover:bg-[#E05B00] transition text-white px-4 py-2 rounded-full flex items-center space-x-2 shadow-md ml-4"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 ? (
              <>
                <span className="font-semibold hidden sm:inline">{totalPrice} ₽</span>
                <span className="bg-white text-[#FF6900] text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              </>
            ) : (
              <span className="font-semibold hidden sm:inline">Корзина</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

// Меню категорий
const CategoryMenu = ({ activeCategory, setActiveCategory }) => {
  return (
    <div className="bg-white/80 backdrop-blur-md sticky top-[72px] z-40 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-6 overflow-x-auto py-4 scrollbar-hide">
          {CATEGORIES.map((category) => (
            <button 
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`whitespace-nowrap font-bold text-base sm:text-lg transition-colors duration-200 px-5 py-2.5 rounded-full ${
              activeCategory === category.id
              ? 'bg-orange-50 text-[#FF6900] shadow-sm'
              : 'text-gray-600 hover:text-[#FF6900] hover:bg-gray-50'
            }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Карточка товара (универсальная для всех разделов с поддержкой variants, image, badge)
const ProductCard = ({ product, onAddToCart, stopped, addons }) => {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedAddon, setSelectedAddon] = useState(addons[0]);

  const basePrice = product.variants ? product.variants[selectedVariant].price : product.price;
  const currentPrice = basePrice + selectedAddon.price;

  const handleAdd = () => {
    onAddToCart(
      product, 
      product.variants ? selectedVariant : null, 
      selectedAddon.id ? [selectedAddon] : []
    );
    setSelectedAddon(addons[0]);
  };

  return (
    <div className={`bg-white rounded-2xl p-4 flex flex-col h-full shadow-sm hover:shadow-lg transition-all duration-300 relative group${stopped ? ' opacity-60' : ''}`}>
      <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-gray-100">
        <img src={product.image} alt={product.name} className={`object-conver w-full h-full${stopped ? ' grayscale' : ''}`} />
        {stopped ? (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            Нет в наличии
          </div>
        ) : product.badge && (
          <div className="absolute top-2 left-2 bg-[#FF6900] text-white text-xs font-bold px-2 py-1 rounded-md">
            {product.badge}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 flex-grow leading-relaxed mb-3">{product.description}</p>
        
        {product.variants && (
          <div className="bg-gray-100 rounded-lg p-1 flex justify-between items-center mb-3">
            {product.variants.map((variant, index) => (
              <button
                key={index}
                onClick={() => setSelectedVariant(index)}
                className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-all ${
                  selectedVariant === index ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
                }`}
              >
                {variant.label}
              </button>
            ))}
          </div>
        )}

        {/* Выпадающее меню доп. ингредиентов для пиццы с ценами */}
        {product.category === 'pizza' && (
          <div className="mb-3">
            <select
              value={selectedAddon.id}
              onChange={(e) => {
                const found = addons.find(a => a.id === e.target.value);
                setSelectedAddon(found);
              }}
              className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#FF6900] text-gray-800 font-medium cursor-pointer shadow-sm"
            >
              {addons.map(addon => (
                <option key={addon.id} value={addon.id}>
                  {addon.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
          <span className="text-xl font-extrabold text-gray-900">{currentPrice} ₽</span>
          {stopped ? (
            <button
              disabled
              className="bg-gray-100 text-gray-400 font-semibold px-5 py-2 rounded-xl text-sm cursor-not-allowed"
            >
              Нет в наличии
            </button>
          ) : (
            <button
              onClick={handleAdd}
              className="bg-[#FFF4ED] text-[#FF6900] hover:bg-[#FF6900] hover:text-white transition font-semibold px-5 py-2 rounded-xl text-sm"
            >
              Выбрать
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
// Сетка товаров
const ProductGrid = ({ title, products, onAddToCart, stoppedIds, addons }) => {
  if (products.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            stopped={stoppedIds.has(product.id)}
            addons={addons}
          />
        ))}
      </div>
    </section>
  );
};

   // Футер
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* 1. Колонка: О нас */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-[#FF6900] text-white p-1.5 rounded font-bold text-lg">
                ГУРМАН
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Готовим с душой каждый день.
            </p>
          </div>

          {/* 2. Колонка: Контакты и время работы */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Контакты</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-[#FF6900]" />
                <div className="flex flex-col">
                   <span>8 962 401-02-10</span>
                   <span>910-210</span>
                </div>
              </li>
              <li className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-[#FF6900]" />
                Ежедневно с 8:00 до 22:00
              </li>
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 text-[#FF6900] mt-1 shrink-0" />
                с. Александровское ул. Войтика 16Б
              </li>
            </ul>
          </div>

          {/* 3. Колонка: Условия доставки */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Условия доставки</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>🚗 Доставка по с. Александровскому</li>
              <li>📦 Заказы принимаются с 10:00 до 19:00</li>
              <li className="text-xs text-gray-300">✨ Бесплатно от 3000 руб.</li>
              <li className="text-xs text-gray-300">💰 При заказе меньше — доставка 200 руб.</li>
            </ul>
          </div>

        </div>
        
        {/* Нижняя полоса с копирайтом и ИП */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <div>
            © {new Date().getFullYear()} Гурман. Все права защищены.
          </div>
          <div className="text-right text-gray-400">
            ИП Конотопцев В. А. | ОГРНИП: 308264907800040 | ИНН: 260105397727
          </div>
        </div>
      </div>
    </footer>
  );
};

// Компонент Корзины (Модальное окно) с оформлением заказа на кухню
const CartModal = ({ isOpen, onClose, cartItems, setCartItems, stoppedIds, autoClosed }) => {
  const [step, setStep] = useState('cart'); // cart → form → success
  const [form, setForm] = useState({ customerName: '', phone: '', orderType: 'pickup', address: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);

  if (!isOpen) return null;

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // Доставка: 200 ₽ при заказе меньше 3000 ₽, от 3000 ₽ — бесплатно
  const deliveryFee = form.orderType === 'delivery' && totalPrice < 3000 ? 200 : 0;
  const grandTotal = totalPrice + deliveryFee;

  const updateQuantity = (cartItemId, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        return { ...item, quantity: item.quantity + delta };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeItem = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const handleClose = () => {
    setStep('cart');
    setFormError(null);
    onClose();
  };

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const submitOrder = async () => {
    if (!form.phone.trim()) {
      setFormError('Укажите телефон — по нему свяжемся по заказу');
      return;
    }
    if (form.orderType === 'delivery' && !form.address.trim()) {
      setFormError('Укажите адрес доставки');
      return;
    }
    const unavailable = cartItems.filter((item) => stoppedIds.has(item.id));
    if (unavailable.length > 0) {
      setFormError(`Эти позиции сейчас недоступны: ${[...new Set(unavailable.map((i) => i.name))].join(', ')}. Уберите их из корзины.`);
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      const result = await api.createOrder({
        customerName: form.customerName,
        phone: form.phone,
        orderType: form.orderType,
        address: form.address,
        comment: form.comment,
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          variantLabel: item.variantLabel,
          addons: item.addons || [],
        })),
      });
      setOrderNumber(result.order.id);
      setStep('success');
      setCartItems([]);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const modalTitle = step === 'form' ? 'Оформление заказа' : 'Ваш заказ';

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">

        {/* Шапка корзины */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">
            {step === 'success' ? 'Заказ принят!' : modalTitle}
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6" />
          </button>
        </div>

        {autoClosed && step !== 'success' && (
          <div className="bg-red-50 border-b border-red-100 text-red-700 text-sm font-semibold text-center py-2.5 px-4">
            🌙 Приём заказов закрыт — возобновится в 10:00 МСК
          </div>
        )}

        {/* --- Шаг 3: заказ успешно отправлен --- */}
        {step === 'success' && (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-800 mb-2">
              Заказ №{orderNumber} принят!
            </h3>
            <p className="text-gray-500 mb-6">
              Он уже появился на экране кухни и скоро начнёт готовиться.
              {form.orderType === 'delivery'
                ? ' Курьер привезёт заказ по указанному адресу.'
                : ' Ждём вас за заказом!'}
            </p>
            <button
              onClick={handleClose}
              className="w-full bg-[#FF6900] hover:bg-[#E05B00] transition-colors text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-orange-500/30"
            >
              Отлично
            </button>
          </div>
        )}

        {/* --- Шаг 1: корзина --- */}
        {step === 'cart' && (
          <>
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  <ShoppingCart className="w-16 h-16 mx-auto text-gray-200 mb-4" />
                  <p className="text-lg">Корзина пока пуста</p>
                  <p className="text-sm mt-1">Добавьте что-нибудь из меню!</p>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.cartItemId} className="flex gap-4 items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg shadow-sm" />
                    <div className="flex-grow">
                      <h4 className="font-bold text-gray-800 leading-tight">{item.name}</h4>
                      {item.variantLabel && (
                        <p className="text-xs text-gray-500 mt-0.5">{item.variantLabel}</p>
                      )}
                      {item.addons?.length > 0 && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          + {item.addons.map(a => a.name.replace(/\s+—\s*\d+ ₽$/, '')).join(', ')}
                        </p>
                      )}
                      {((item.category === 'mangal' || item.category === 'salads' || item.category === 'hot' || item.category === 'garnish') && !item.variants) && (
                        <p className="text-xs text-gray-500 mt-0.5">за 100 г</p>
                      )}
                      {stoppedIds.has(item.id) && (
                        <p className="text-xs text-red-600 font-semibold mt-0.5">Нет в наличии — уберите из корзины</p>
                      )}
                      <p className="font-bold text-[#FF6900] mt-1">{item.price} ₽</p>
                    </div>

                    {/* Контролы количества и кнопка удаления */}
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeItem(item.cartItemId)}
                        className="text-gray-400 hover:text-[#FF6900] transition-colors"
                        title="Удалить из корзины"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, -1)}
                          className="p-1.5 text-gray-500 hover:text-[#FF6900] transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-7 text-center font-semibold text-sm text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, 1)}
                          className="p-1.5 text-gray-500 hover:text-[#FF6900] transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Подвал корзины */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-white shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 font-medium text-lg">Итого:</span>
                  <span className="text-3xl font-extrabold text-gray-900">{totalPrice} ₽</span>
                </div>
                <button
                  onClick={() => setStep('form')}
                  className="w-full bg-[#FF6900] hover:bg-[#E05B00] transition-colors text-white py-3.5 rounded-xl font-bold text-lg flex justify-center items-center gap-2 shadow-lg shadow-orange-500/30"
                >
                  Оформить заказ
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">
                  Или по телефону: <a href="tel:89624010210" className="text-[#FF6900] font-semibold">8 962 401-02-10</a>
                </p>
              </div>
            )}
          </>
        )}

        {/* --- Шаг 2: форма оформления --- */}
        {step === 'form' && (
          <>
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {/* Способ получения */}
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-2">Способ получения</label>
                <div className="grid grid-cols-2 gap-2 bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => updateForm('orderType', 'pickup')}
                    className={`py-2.5 rounded-lg font-semibold text-sm transition ${form.orderType === 'pickup' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                  >
                    Самовывоз
                  </button>
                  <button
                    onClick={() => updateForm('orderType', 'delivery')}
                    className={`py-2.5 rounded-lg font-semibold text-sm transition ${form.orderType === 'delivery' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                  >
                    Доставка
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1">Телефон *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateForm('phone', e.target.value)}
                  placeholder="+7 900 000-00-00"
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#FF6900] text-gray-800"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1">Ваше имя</label>
                <input
                  type="text"
                  value={form.customerName}
                  onChange={(e) => updateForm('customerName', e.target.value)}
                  placeholder="Как к вам обращаться"
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#FF6900] text-gray-800"
                />
              </div>

              {form.orderType === 'delivery' && (
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-1">Адрес доставки *</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => updateForm('address', e.target.value)}
                    placeholder="Улица, дом, квартира"
                    className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#FF6900] text-gray-800"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1">Комментарий к заказу</label>
                <textarea
                  value={form.comment}
                  onChange={(e) => updateForm('comment', e.target.value)}
                  placeholder="Например: без лука, позвонить за 10 минут"
                  rows={2}
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#FF6900] text-gray-800 resize-none"
                />
              </div>

              {formError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">{formError}</p>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-white shadow-lg">
              {form.orderType === 'delivery' && (
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Доставка</span>
                  <span className="font-semibold">{deliveryFee > 0 ? `${deliveryFee} ₽` : 'бесплатно'}</span>
                </div>
              )}
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 font-medium text-lg">Итого:</span>
                <span className="text-3xl font-extrabold text-gray-900">{grandTotal} ₽</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('cart')}
                  disabled={submitting}
                  className="px-5 py-3.5 rounded-xl font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Назад
                </button>
                <button
                  onClick={submitOrder}
                  disabled={submitting || autoClosed}
                  className="flex-1 bg-[#FF6900] hover:bg-[#E05B00] transition-colors text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-orange-500/30 disabled:opacity-60"
                >
                  {autoClosed ? 'Заказы принимаются с 10:00 МСК' : submitting ? 'Отправляем...' : 'Отправить заказ'}
                </button>
              </div>
              {form.orderType === 'delivery' && totalPrice > 0 && totalPrice < 3000 && (
                <p className="text-center text-xs text-[#FF6900] font-semibold mt-3">
                  Добавьте ещё {3000 - totalPrice} ₽ до бесплатной доставки
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Главный компонент магазина (со своими состояниями и корзиной)
function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('pizza');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [stoppedIds, setStoppedIds] = useState(() => new Set());
  // Меню с сервера; null = грузится или сервер недоступен,
  // тогда показываем вшитую копию (приложение работает и без интернета)
  const [serverMenu, setServerMenu] = useState(null);
  const [serverAddons, setServerAddons] = useState(null);
  const [autoClosed, setAutoClosed] = useState(false);

  // Меню с сервера: цены и состав обновляются без пересборки приложения
  useEffect(() => {
    const loadMenu = () => api.fetchMenu()
      .then((data) => { setServerMenu(data.products); setServerAddons(data.addons); })
      .catch(() => {});
    loadMenu();
    const onFocus = () => loadMenu();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  // Стоп-лист: обновляем раз в минуту и при возврате на вкладку,
  // чтобы позиции снимались с продажи без перезагрузки страницы
  useEffect(() => {
    const loadStops = () => api.fetchStops()
      .then((data) => {
        setStoppedIds(new Set(data.stops.map((s) => Number(s.id))));
        setAutoClosed(!!data.autoClosed);
      })
      .catch(() => {});
    loadStops();
    const poll = setInterval(loadStops, 60000);
    const onFocus = () => loadStops();
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(poll);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const handleAddToCart = (product, selectedVariantIndex, selectedAddons = []) => {
    setCartItems(prev => {
      const hasVariants = !!product.variants;
      const addonsPrice = selectedAddons.reduce((sum, a) => sum + a.price, 0);
      const price = (hasVariants ? product.variants[selectedVariantIndex].price : product.price) + addonsPrice;
      const variantLabel = hasVariants ? product.variants[selectedVariantIndex].label : null;
      const addonKey = selectedAddons.map(a => a.id).sort().join(',');
      const cartItemId = `${product.id}-${hasVariants ? selectedVariantIndex : 'x'}-${addonKey}`;

      const existingItem = prev.find(item => item.cartItemId === cartItemId);
      if (existingItem) {
        return prev.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, {
        ...product,
        cartItemId,
        price,
        variantLabel,
        addons: selectedAddons,
        quantity: 1
      }];
    });
  };

  const allProducts = serverMenu || MENU_DATA;

  const displayedProducts = useMemo(() => {
    return allProducts.filter(item => item.category === activeCategory);
  }, [allProducts, activeCategory]);

  const categoryTitle = CATEGORIES.find(c => c.id === activeCategory)?.label || 'Меню';

  return (
    <div className="bg-[#F9FAFB] min-h-screen font-sans flex flex-col">
      <Header 
        cartItems={cartItems} 
        onOpenCart={() => setIsCartOpen(true)}
      />

      {autoClosed && (
        <div className="bg-red-600 text-white text-center text-sm font-semibold py-2.5 px-4">
          🌙 Приём заказов закрыт — возобновится в 10:00 МСК. Корзину можно собрать заранее
        </div>
      )}
      
      {/* Главный баннер */}
      <div className="relative bg-gray-900 text-white overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0">
          <img 
            src="gurman-zastavka.jpg" 
            alt="Фон" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start">
          <span className="bg-[#FF6900] text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            с. Александровское
          </span>
          <p className="text-lg text-gray-200 mb-8 max-w-xl">
             Кулинария супермаркета "Гурман".
          </p>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 max-w-2xl">
             Готовим с душой каждый день
          </h1>
          <div className="flex flex-wrap gap-4">
            <a 
              href="tel:89624010210" 
              className="bg-[#FF6900] hover:bg-[#E05B00] text-white font-bold px-6 py-3.5 rounded-xl flex items-center gap-2 transition shadow-lg shadow-orange-600/30"
            >
              <Phone className="w-5 h-5" />
              8 962 401-02-10
            </a>
          </div>
        </div>
      </div>

      <CategoryMenu 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
      />

      <ReelsSection />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {displayedProducts.length > 0 ? (
          <ProductGrid
            title={categoryTitle}
            products={displayedProducts}
            onAddToCart={handleAddToCart}
            stoppedIds={stoppedIds}
            addons={serverAddons || PIZZA_ADDONS}
          />
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-400">В этой категории пока нет товаров</h2>
            <p className="text-gray-500 mt-2">Мы уже работаем над пополнением меню!</p>
          </div>
        )}
      </main>

      <Footer />

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        setCartItems={setCartItems}
        stoppedIds={stoppedIds}
        autoClosed={autoClosed}
      />
    </div>
  );
}

// Главная страница сайта (маршруты, включая /kitchen, настраиваются в main.jsx)
export default function App() {
  return <ShopPage />;
}