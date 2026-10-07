import React, { useState, useMemo } from 'react';
import { Phone, Clock, MapPin, ChevronRight, Menu, ShoppingCart, X, Minus, Plus, Trash2, Check } from 'lucide-react';

// 1. Добавьте этот массив в самое начало файла (перед компонентами)
const PIZZA_ADDONS = [
  { id: '', name: 'Без доп. ингредиентов', price: 0 },
  { id: 'cheese', name: 'Сыр Моцарелла — 69 ₽', price: 69 },
  { id: 'jalapeno', name: 'Перец Халапеньо — 49 ₽', price: 49 },
  { id: 'tomato', name: 'Томаты — 49 ₽', price: 49 },
  { id: 'cheesedrop', name: 'Соус Сырный — 39 ₽', price: 39 },
  { id: 'bbq', name: 'Соус Барбекю — 39 ₽', price: 39 },
  { id: 'bacon', name: 'Бекон — 89 ₽', price: 89 },
];

// 1. Мок-данные меню (с поддержкой image, badge и variants для всех разделов)
const MENU_DATA = [
  // --- ПИЦЦА ---
  {
    id: 1,
    name: 'ГУРМАН',
    description: 'Томатный соус, ветчина, бекон, охотничьи колбаски, помидоры, моцарелла, зелень',
    price: 359,
    variants: [
      { label: '20 см', price: 325 },
      { label: '30 см', price: 595 }
    ],
    badge: 'Хит продаж',
    image: 'gurman.png',
    category: 'pizza'
  },
  {
    id: 2,
    name: 'Пепперони',
    description: 'Пикантная пепперони, увеличенная порция моцареллы, томатный соус',
    price: 289,
    variants: [
      { label: '20 см', price: 275 },
      { label: '30 см', price: 635 }
    ],
    badge: 'Острая',
    image: 'pepperoni-pizza.png',
    category: 'pizza'
  },
  {
    id: 3,
    name: '4 сыра',
    description: 'Пармезан, чедер, много моцареллы, дор блю, чесночное масло',
    price: 249,
    variants: [
      { label: '20 см', price: 315 },
      { label: '30 см', price: 725 }
    ],
    badge: null,
    image: '4sira-pizza-.png',
    category: 'pizza'
  },
  {
    id: 4,
    name: 'Вашингтон',
    description: 'Колбаса варена копченая, помидоры, перец болгарский, майонез, моцарелла, фирменный томатный соус',
    price: 389,
    variants: [
      { label: '20 см', price: 275 },
      { label: '30 см', price: 595 }
    ],
    badge: null,
    image: 'washengton.png',
    category: 'pizza'
  },
  {
    id: 5,
    name: 'Гавайская',
    description: 'Сочные ананасы, колбаса варена копченая, фирменный томатный соус, моцареллы',
    price: 299,
    variants: [
      { label: '20 см', price: 315 },
      { label: '30 см', price: 535 }
    ],
    badge: 'Новинка',
    image: 'gawai.png',
    category: 'pizza'
  },
  {
    id: 6,
    name: 'Бургер-пицца',
    description: 'Ветчина, томаты, маринованные огурчики, моцарелла, красный лук, соус бургер, фирменный томатный соус',
    price: 399,
    variants: [
      { label: '20 см', price: 275 },
      { label: '30 см', price: 625 }
    ],
    badge: 'Хит',
    image: 'burger-pizza.png',
    category: 'pizza'
  }, 
  {
    id: 7,
    name: 'Диабло',
    description: 'Томатный соус, ветчина, пепперони, охотничьи колбаски, острый перчик, лук, моцарелла',
    price: 349,
    variants: [
      { label: '20 см', price: 275 },
      { label: '30 см', price: 595 }
    ],
    badge: 'Острая',
    image: 'diablo.png',
    category: 'pizza'
  }, 
  {
    id: 8,
    name: 'Цезарь',
    description: 'Чесночное масло, курочка, моцарелла, помидоры, соус ранч, салат листовой',
    price: 269,
    variants: [
      { label: '20 см', price: 275 },
      { label: '30 см', price: 535 }
    ],
    badge: null,
    image: 'cezar.png',
    category: 'pizza'
  },
  {
    id: 9,
    name: 'Жульен',
    description: 'Куриное филе, шампиньоны, насыщенный грибной соус, сыр моцарелла',
    price: 329,
    variants: [
      { label: '20 см', price: 365 },
      { label: '30 см', price: 595 }
    ],
    badge: 'Хит',
    image: 'zulen.png',
    category: 'pizza'
  },
  {
    id: 10,
    name: 'Барбекю',
    description: 'Сочная ветчина, бекон, соус барбекю, болгарский перец, томаты, сыр моцарелла',
    price: 369,
    variants: [
      { label: '20 см', price: 275 },
      { label: '30 см', price: 655 }
    ],
    badge: null,
    image: 'bbq.png',
    category: 'pizza'
  }, 
  {
    id: 11,
    name: 'Вегетарианская',
    description: 'Томаты, сладкий перец, шампиньоны, красный лук, фирменный томатный соус, моцарелла',
    price: 279,
    variants: [
      { label: '20 см', price: 235 },
      { label: '30 см', price: 525 }
    ],
    badge: 'Легкая',
    image: 'veget1.png',
    category: 'pizza'
  }, 
  {
    id: 12,
    name: 'Пицца с семгой',
    description: 'Семга, фирминый соус, моцарелла, томат, маслины, рукола, перец болгарский',
    price: 459,
    variants: [
      { label: '30 см', price: 795 }
    ],
    badge: 'Премиум',
    image: 's-semgoi.png',
    category: 'pizza'
  }, 
  {
    id: 13,
    name: 'Чиз карбонара',
    description: 'Бекон, курица, томат, моцарелла, сырный соус, хрустящий лук',
    price: 339,
    variants: [
      { label: '20 см', price: 365 },
      { label: '30 см', price: 595 }
    ],
    badge: null,
    image: 'chiz-carbonara.png',
    category: 'pizza'
  },
  {
    id: 14,
    name: 'Охотничья',
    description: 'Томатный соус, салями, охотничьи колбаски, бекон, острый перчик, маринованные огурчики, грибы, моцарелла',
    price: 319,
    variants: [
      { label: '20 см', price: 355 },
      { label: '30 см', price: 755 }
    ],
    badge: 'Острая',
    image: 'ohotnichia.png',
    category: 'pizza'
  },
  {
    id: 15,
    name: 'Мексиканская',
    description: 'Томатный соус, куриный фарш, томат, лук, острый перчик, моцарелла',
    price: 319,
    variants: [
      { label: '20 см', price: 315 },
      { label: '30 см', price: 675 }
    ],
    badge: 'Острая',
    image: 'mexika.png',
    category: 'pizza'
  },
  {
    id: 150,
    name: 'Пицца с морепродуктами',
    description: 'Томатный соус, тигровые креветки, перец болгарский, моцарелла',
    price: 319,
    variants: [
      { label: '30 см', price: 695 }
    ],
    badge: 'Премиум',
    image: 'more1.png',
    category: 'pizza'
   },

  // --- ФАСТ ФУД ---
  {
    id: 16,
    name: 'Гриль бургер с говядиной',
    description: 'Сочная говяжья котлета, 2 ломтика чеддера, салат айсберг, помидоры, соленые огурчики, лук, фирменный соус гриль',
    price: 295,
    badge: 'Хит продаж',
    image: 'gril.png',
    category: 'fastfood'
  },
  {
    id: 17,
    name: 'Чикенбургер с куриной котлетой',
    description: 'Хрустящая куриная котлета, салат, помидоры,огурец соленый, соус ранч, сырный соус',
    price: 235,
    badge: null,
    image: 'chicen-burger.png',
    category: 'fastfood'
  },
  {
    id: 18,
    name: 'Фреш ролл',
    description: 'Пшеничная лепешка, куриное филе, салат айсберг, томаты, огурец свежий, соус ранч',
    price: 195,
    badge: null,
    image: 'roll12.png',
    category: 'fastfood'
  }, 
  {
    id: 19,
    name: 'Бурито',
    description: 'Куриный фарш со специями, огурец, кетчуп, соус ранч, мексиканская лепешка, томат.',
    price: 165,
    badge: 'Хит',
    image: 'burito.jpg',
    category: 'fastfood'
  }, 
  {
    id: 20,
    name: 'Ролл мясной',
    description: 'СуПеР МяСнОй ролл в пшеничной лепёшке с сырам чеддер и нежной моцареллой, томатами, пепперони и куриным фаршем под знакомым соусом гриль с дымком!',
    price: 165,
    badge: 'Хит',
    image: 'mysnoy3.png',
    category: 'fastfood'
  },
  {
    id: 21,
    name: 'Ролл Сырный с курицей',
    description: 'Лепешка пшеничная, моцарелла, филе куриное, жареный лучок, помидоры, сырный соус',
    price: 165,
    badge: null,
    image: 'syrniy-roll2.png',
    category: 'fastfood'
  }, 
  {
    id: 22,
    name: 'Бургер Нью Йорк',
    description: 'Черная булочка, говяжья котлета, сыр чедер, бекон, лук, огурец соленый, соус сырный, фирменый острый соус',
    price: 295,
    badge: 'Новинка',
    image: 'negr.png',
    category: 'fastfood'
  }, 
  {
    id: 23,
    name: 'Картофель фри',
    description: 'ЦЕНА ЗА 100 грамм! Золотистая, хрустящая снаружи и мягкая внутри картошка фри с солью.',
    price: 65,
    badge: 'Топ',
    unit: '100 г.',
    image: 'kartofel-fri.png',
    category: 'fastfood'
  },
  {
    id: 24,
    name: 'Картофель Айдахо',
    description: 'ЦЕНА ЗА 100 грамм! Крупные дольки картофеля со специями, обжаренные до румяной корочки.',
    price: 33,
    badge: null,
    unit: '100 г.',
    image: 'kartofel-derevna.png',
    category: 'fastfood'
  },
  {
    id: 25,
    name: 'Ролл дракон',
    description: 'Сыр, охотничьи колбаски, маринованные огурчики и перчик халапеньо с барбекю соусом в зажаристой пшеничной лепешке.',
    price: 165,
    badge: null,
    image: 'dracon2.png',
    category: 'fastfood'
  },
  {
    id: 26,
    name: 'Шаурма с курицей',
    description: 'Обжаренное куриное филе, свежие овощи, фирменный чесночный соус, завернутые в тонкий лаваш.',
    price: 175,
    badge: 'Сытно',
    image: 'shaurma1.png',
    category: 'fastfood'
  },
  {
    id: 27,
    name: 'Гиро с курицой',
    description: 'Сочная курица, картофель фри, капуста, томаты, огурцы, пикантный соус.',
    price: 175,
    badge: null,
    image: 'giro1.png',
    category: 'fastfood'
  }, /*
  {
    id: 28,
    name: 'Хот-дог классический',
    description: 'Мясная сосиска в мягкой булочке с кетчупом, горчицей и хрустящим луком.',
    price: 84,
    badge: null,
    image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&q=80&w=600',
    category: 'fastfood'
  }, */
  {
    id: 29,
    name: 'Френч-дог с курино-говяжей сосиской',
    description: 'Обжаренная сосиска в закрытой французской булочке с соусом.',
    price: 125,
    badge: null,
    image: 'dog.jpg',
    category: 'fastfood'
  },
  {
    id: 30,
    name: 'Сэндвич с ветчиной',
    description: 'Поджаренный тостовый хлеб, ветчина, сыр, листья салата, помидоры, майонез.',
    price: 165,
    badge: null,
    image: 'send-vetshina.jpg',
    category: 'fastfood'
  },
  {
    id: 31,
    name: 'Сэндвич с курицей',
    description: 'Нежное куриное филе, сыр, свежие овощи и легкий соус в хрустящем хлебе.',
    price: 115,
    badge: null,
    image: 'send-kuriza.jpg',
    category: 'fastfood'
  },
  {
    id: 32,
    name: 'Острые крылышки Баффало (5 шт)',
    description: 'Куриные крылышки в пикантной острой панировке. Осторожно, очень остро!',
    price: 199,
    badge: 'Острое',
    image: 'baffalo.png',
    category: 'fastfood'
  }, /*
  {
    id: 33,
    name: 'Куриные стрипсы (4 шт)',
    description: 'Длинные кусочки куриного филе в хрустящей оригинальной панировке.',
    price: 169,
    badge: null,
    image: 'https://images.unsplash.com/photo-1569691899455-88464f6d3ab1?auto=format&fit=crop&q=80&w=600',
    category: 'fastfood'
  }, */
  {
    id: 34,
    name: 'Боксмастер',
    description: 'Мексиканская лепешка с начинкой из куриных стрипсов, картофельной котлете, овощей, сырный соус и соус ранч, обжаренная в печи.',
    price: 255,
    badge: 'Новинка',
    image: 'boxmaster.png',
    category: 'fastfood'
  }, /*
  {
    id: 35,
    name: 'Бургер Барбекю',
    description: 'Говяжья котлета, бекон, сыр чеддер, салат, томаты, хрустящий лук и соус BBQ.',
    price: 249,
    badge: null,
    image: 'https://images.unsplash.com/photo-1594212848116-b8db5d858f96?auto=format&fit=crop&q=80&w=600',
    category: 'fastfood'
  },
  {
    id: 36,
    name: 'Фишбургер',
    description: 'Нежное филе белой рыбы в панировке, сыр чеддер, салат айсберг и соус тартар.',
    price: 189,
    badge: null,
    image: 'https://images.unsplash.com/photo-1615865417482-15f2125ce09b?auto=format&fit=crop&q=80&w=600',
    category: 'fastfood'
  },
  {
    id: 37,
    name: 'Сырный бургер',
    description: 'Для фанатов сыра: котлета из говядины, сырная котлета, соус сырный, чеддер.',
    price: 279,
    badge: null,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&q=80&w=600',
    category: 'fastfood'
  }, */
 
/*
  // --- САЛАТЫ ---
  { 
    id: 38,
    name: 'Салат Крабовые палочки с ананасом',
    description: 'Нежный салат из крабовых палочек с сочными ананасами',
    price: 49,
    badge: 'Хит',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600',
    category: 'salads'
  },
  { 
    id: 39 
    name: 'Салат "Жозефина"', 
    description: 'Фирменный салат от шефа', 
    price: 58, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 40, 
    name: 'Салат Печень куриная с солеными грибами', 
    description: 'Сытный салат с куриной печенью и ароматными грибочками', 
    price: 57, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  {
     id: 41, 
     name: 'Салат "Из свежей моркови с сыром"', 
     description: 'Легкий и витаминный салат', 
     price: 33, 
     badge: null, 
     image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&q=80&w=600', 
     category: 'salads' 
    },
  { 
    id: 42, 
    name: 'Фасоль с жареными грибами и сыром', 
    description: 'Пикантное сочетание фасоли, грибов и сыра', 
    price: 63, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 43, 
    name: 'Салат "Фестиваль"', 
    description: 'Яркий и вкусный салат', 
    price: 47, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 44, 
    name: 'Салат "Мозаика"', 
    description: 'Разнообразие вкусов в одном блюде', 
    price: 52, badge: null, 
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 45, 
    name: 'Салат "Парус"', 
    description: 'Классический популярный салат', 
    price: 42, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 46, 
    name: 'Салат "Россия"', 
    description: 'Традиционные ингредиенты и прекрасный вкус', 
    price: 39, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 47, 
    name: 'Салат "Из печени трески"', 
    description: 'Изысканный салат с богатым вкусом', 
    price: 73, 
    badge: 'Популярное', 
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 48, 
    name: 'Салат "Невод"', 
    description: 'С дарами моря', 
    price: 95, 
    badge: 'Премиум', 
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 49, 
    name: 'Салат "Фурор"', 
    description: 'Произведет фурор за вашим столом', 
    price: 49, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 50, 
    name: 'Салат "Хрустантик"', 
    description: 'Хрустящий и освежающий салат', 
    price: 62, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 51, 
    name: 'Салат "Из ветчины и картофеля"',
    description: 'Сытный домашний салат', 
    price: 39, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 52, 
    name: 'Салат "Легкий"', 
    description: 'Ничего лишнего, только свежесть', 
    price: 54, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 53, 
    name: 'Салат "Перекус"', 
    description: 'Отличный вариант для быстрого перекуса', 
    price: 57, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 54, 
    name: 'Салат "Дачница"', 
    description: 'Летний вкус круглый год', 
    price: 55, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 55, 
    name: 'Салат с куриной печенью, грибами и помидорами', 
    description: 'Изысканное сочетание компонентов', 
    price: 40, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 56, 
    name: 'Салат "С копченым мясом и овощами"', 
    description: 'С ярким копченым ароматом', 
    price: 59, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 57, 
    name: 'Салат "Гости на пороге"', 
    description: 'Быстро, сытно и очень вкусно', 
    price: 45, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 58, 
    name: 'Салат из кальмаров', 
    description: 'Нежные кусочки кальмаров с отборными ингредиентами', 
    price: 82, 
    badge: 'Хит', 
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 59, 
    name: 'Салат с куриным филе, кукурузой и яблоком', 
    description: 'Оригинальное кисло-сладкое сочетание', 
    price: 54, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 60, 
    name: 'Салат "Изысканный"', 
    description: 'Для ценителей утонченных вкусов', 
    price: 30, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 61, 
    name: 'Салат "Полосатик"', 
    description: 'Красивая подача и отменный вкус', 
    price: 66, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 62, 
    name: 'Салат с крабовыми палочками, зеленью и огурцом', 
    description: 'Свежий и легкий салат', 
    price: 54, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 63, 
    name: 'Салат "Дворянский"', 
    description: 'Богатый состав и великолепный вкус', 
    price: 75, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 64, 
    name: 'Салат с креветками и гребешками', 
    description: 'Премиальный морской салат', 
    price: 68, 
    badge: 'Премиум', 
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  {
    id: 65, 
    name: 'Салат из куриного филе с фасолью', 
    description: 'Сытный белковый салат', 
    price: 52, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 66, 
    name: 'Салат из пекинской капусты с копченой курицей', 
    description: 'Нежная пекинская капуста с копченой курочкой', 
    price: 55, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 67, 
    name: 'Салат "С свежим огурцом и редисом"', 
    description: 'Весенняя свежесть на вашем столе', 
    price: 39, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },

  // --- ГОРЯЧИЕ БЛЮДА ---
  { 
    id: 68, 
    name: 'Плов из курицы', 
    description: 'Рассыпчатый рис с сочной курицей и восточными специями', 
    price: 40, 
    badge: 'Хит', 
    image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&q=80&w=600', 
    category: 'hot' 
  },
  { 
    id: 69, 
    name: 'Плов из утки', 
    description: 'Ароматный плов с нежным мясом утки', 
    price: 65, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&q=80&w=600', 
    category: 'hot' 
  },
  { 
    id: 70, 
    name: 'Вареники по-домашнему в ассорт.', 
    description: 'Традиционные домашние вареники', 
    price: 18, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=600', 
    category: 'hot' 
  },
  { 
    id: 71, 
    name: 'Омлет в ассорт.', 
    description: 'Пышный и нежный омлет', 
    price: 44, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&q=80&w=600', 
    category: 'hot' 
  },
  { 
    id: 72, 
    name: 'Печеночный торт', 
    description: 'Слоистый нежный печеночный торт с прослойкой', 
    price: 65, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600', 
    category: 'hot' 
  },
  { 
    id: 73, 
    name: 'Плов из свинины', 
    description: 'Сытный плов с отборной свининой', 
    price: 65, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&q=80&w=600', 
    category: 'hot' 
  },
  { 
    id: 74, 
    name: 'Запеканка из блинчиков', 
    description: 'Сладкая или сытная запеканка из румяных блинчиков', 
    price: 55, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=600', 
    category: 'hot' 
  },
  { 
    id: 75, 
    name: 'Котлета по-княжески', 
    description: 'Фирменная сочная котлета', 
    price: 67, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&q=80&w=600', 
    category: 'hot'
  },
  { 
    id: 76, 
    name: 'Язык говяжий отварной', 
    description: 'Нежнейший деликатесный отварной язык', 
    price: 125, 
    badge: 'Премиум', 
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=600', 
    category: 'hot' 
  },
  { 
    id: 77, 
    name: 'Бифштекс с грибами', 
    description: 'Сочный бифштекс под грибным соусом', 
    price: 65, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1544025162-83141f2389d4?auto=format&fit=crop&q=80&w=600', 
    category: 'hot' 
  },
  { 
    id: 78, 
    name: 'Говядина тушеная с луком', 
    description: 'Мягкие кусочки говядины в подливке', 
    price: 125, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=600', 
    category: 'hot' 
  },
  { 
    id: 79, 
    name: 'Шницель по-деревенски', 
    description: 'Хрустящий шницель из отборного мяса', 
    price: 64, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&q=80&w=600', 
    category: 'hot' 
  },
  { 
    id: 80, 
    name: 'Печень куриная в сметане', 
    description: 'Куриная печень в мягком сметанном соусе', 
    price: 45, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600', 
    category: 'hot' 
  },
  { 
    id: 81, 
    name: 'Печень по-строгановски', 
    description: 'Классическое блюдо с подливкой', 
    price: 65, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600', 
    category: 'hot' 
  },
  { 
    id: 82, 
    name: 'Азу по-татарски', 
    description: 'Традиционное остро-пряное блюдо', 
    price: 85, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=600', 
    category: 'hot' 
  },

  // --- ГАРНИРЫ ---
  { 
    id: 83, 
    name: 'Картофель жареный с грибами', 
    description: 'Ароматный картофель с жареными грибочками', 
    price: 39, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1626200926732-475253272990?auto=format&fit=crop&q=80&w=600', 
    category: 'garnish' 
  },
  { 
    id: 84, 
    name: 'Кабачки жареные с чесноком', 
    description: 'Нежные кабачки с пикантным чесночным ароматом', 
    price: 29, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=600', 
    category: 'garnish' 
  },
  { 
    id: 85, 
    name: 'Отварной картофель с укропом', 
    description: 'Классический отварной картофель со сливочным маслом и зеленью', 
    price: 39, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1626200926732-475253272990?auto=format&fit=crop&q=80&w=600', 
    category: 'garnish' 
  },
  {
    id: 86, 
    name: 'Картофель фри', 
    description: 'Золотистая картошка обжариная во фритюре', 
    price: 33, 
    badge: null, 
    image: 'kartofel-fri.png', 
    category: 'garnish' 
  },
  { 
    id: 87, 
    name: 'Гарнир "Из Перловки"', 
    description: 'Полезная и питательная перловая крупа', 
    price: 19, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d4490c?auto=format&fit=crop&q=80&w=600', 
    category: 'garnish' 
  },
  { 
    id: 88, 
    name: 'Гарнир "Булгур с овощами"', 
    description: 'Булгур с добавлением сочных овощей', 
    price: 44, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d4490c?auto=format&fit=crop&q=80&w=600', 
    category: 'garnish' 
  },
  { 
    id: 89, 
    name: 'Гарнир "Рис с грибами"', 
    description: 'Рассыпчатый рис с обжаренными грибами', 
    price: 39, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d4490c?auto=format&fit=crop&q=80&w=600', 
    category: 'garnish' 
  },
  { 
    id: 90, 
    name: 'Гарнир "Рис"', 
    description: 'Классический рисовый гарнир', 
    price: 20, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d4490c?auto=format&fit=crop&q=80&w=600', 
    category: 'garnish' 
  },
  { 
    id: 91, 
    name: 'Фасоль по-грузински', 
    description: 'Пикантная фасоль со специями и зеленью', 
    price: 20, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600', 
    category: 'garnish' 
  },
  { 
    id: 92, 
    name: 'Картофель Айдахо', 
    description: 'Запеченный до золотистой корочки картофель', 
    price: 17, 
    badge: null, 
    image: 'kartofel-derevna.png', 
    category: 'garnish' 
  },*/
/*
// --- ВЫПЕЧКА ---
  {
    id: 93,
    name: 'Котлета в тесте',
    description: 'Сочное рубленое мясо с луком в хрустящем слоеном тесте, запеченное в печи',
    price: 90,
    badge: 'Хит',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=600',
    category: 'bakery'
  },
  {
    id: 94,
    name: 'Осетинский пирог с мясом',
    description: 'Нежное куриное филе, шампиньоны и сыр в ароматной сдобной выпечке',
    price: 150,
    badge: 'Новинка',
    image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&q=80&w=600',
    category: 'bakery'
  },
  {
    id: 95,
    name: 'Хачапури',
    description: 'Два вида сыра в слоеном тесте',
    price: 220,
    badge: 'Популярное',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600',
    category: 'bakery'
  },
  {
    id: 96,
    name: 'Осетинский пирог с сыром и зеленью',
    description: 'Сочное рубленое мясо с луком в хрустящем слоеном тесте, запеченное в печи',
    price: 90,
    badge: 'Хит',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=600',
    category: 'bakery'
  },
  {
    id: 97,
    name: 'Осетинский пирог с сыром и картофелем',
    description: 'Нежное куриное филе, шампиньоны и сыр в ароматной сдобной выпечке',
    price: 150,
    badge: 'Новинка',
    image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&q=80&w=600',
    category: 'bakery'
  },
  {
    id: 98,
    name: 'Кекс',
    description: 'Лодочка из сдобного теста с тянущимся сыром сулугуни и свежим желтым яйцом',
    price: 25,
    badge: 'Популярное',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600',
    category: 'bakery'
  },
   {
    id: 99,
    name: 'Пирожки с картошкой',
    description: 'Лодочка из сдобного теста с тянущимся сыром сулугуни и свежим желтым яйцом',
    price: 29,
    badge: 'Популярное',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600',
    category: 'bakery'
  },
   {
    id: 100,
    name: 'Пирожки с печенью',
    description: 'Лодочка из сдобного теста с тянущимся сыром сулугуни и свежим желтым яйцом',
    price: 29,
    badge: 'Популярное',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600',
    category: 'bakery'
  },
   {
    id: 101,
    name: 'Пирожки с капустой',
    description: 'Лодочка из сдобного теста с тянущимся сыром сулугуни и свежим желтым яйцом',
    price: 29,
    badge: 'Популярное',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600',
    category: 'bakery'
  },
   {
    id: 102,
    name: 'Пирожки с луком и яйцом',
    description: 'Лодочка из сдобного теста с тянущимся сыром сулугуни и свежим желтым яйцом',
    price: 29,
    badge: 'Популярное',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600',
    category: 'bakery'
  },
   {
    id: 103,
    name: 'Сосиска в тесте',
    description: 'Лодочка из сдобного теста с тянущимся сыром сулугуни и свежим желтым яйцом',
    price: 45,
    badge: 'Популярное',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600',
    category: 'bakery'
  },
   {
    id: 104,
    name: 'Беляши',
    description: 'Лодочка из сдобного теста с тянущимся сыром сулугуни и свежим желтым яйцом',
    price: 55,
    badge: 'Популярное',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600',
    category: 'bakery'
  },*/

 // --- МАНГАЛ ---
  {
    id: 105,
    name: 'Шашлык из свинины (антрекот)',
    description: 'Кусочки антрекота, маринованные по фирменному рецепту и обжаренные на углях. Подается с луком.',
    price: 155,
    badge: 'Хит продаж',
    image: 'antrikot.jpg',
    category: 'mangal'
  }, /*
  {
    id: 126,
    name: 'Шашлык из свинины (медальоны)',
    description: 'Нежные медальоны из свинины, приготовленные на мангале до золотистой корочки.',
    price: 169,
    badge: null,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600',
    category: 'mangal'
  }, */
  {
    id: 107,
    name: 'Шашлык из свинины (шея)',
    description: 'Сочный и мягкий шашлык из свиной шейки со специями.',
    price: 169,
    badge: 'Хит',
    image: 'shey1.jpg',
    category: 'mangal'
  },
  {
     id: 108,
    name: 'Сувлаки свиные',
    description: 'Мякоть свинины жареная на мангале.',
    price: 169,
    badge: null,
    image: 'suwlak-svinina.jpg',
    category: 'mangal'
  },/*
   {
    id: 106,
    name: 'Ребрышки свиные',
    description: 'Сочные свиные ребрышки, запеченные на огне.',
    price: 115,
    badge: 'Хит',
    image: 'https://images.unsplash.com/photo-1544025162-83141f2389d4?auto=format&fit=crop&q=80&w=600',
    category: 'mangal'
  },*/
  {  
    id: 110,
    name: 'Шашлык из куриного филе',
    description: 'Нежное куриное филе со специями, приготовленное на мангале. Диетический и очень вкусный выбор.',
    price: 155,
    badge: null,
    image: 'suvlak-curiza.jpg',
    category: 'mangal'
  },
  {
    id: 109,
    name: 'Шашлык из куриного бедра',
    description: 'Сочное куриное бедро на косточке, зажаренное на углях.',
    price: 115,
    badge: null,
    image: 'bedro.jpg',
    category: 'mangal'
  },
   {
    id: 111,
    name: 'Куриные крылья на углях',
    description: 'Сочные куриные крылышки, замаринованные в пикантном соусе и обжаренные до золотистой корочки.',
    price: 135,
    badge: 'К пиву',
    image: 'crilo1.jpg',
    category: 'mangal'
  },
  {
    id: 112,
    name: 'Голень куриная',
    description: 'Куриная голень в пряном маринаде на мангале.',
    price: 115,
    badge: null,
    image: 'golen.jpg',
    category: 'mangal'
  }, /*
  {
    id: 141,
    name: 'Шашлык из индейки',
    description: 'Диетический, невероятно нежный шашлык из филе грудки индейки в легком маринаде.',
    price: 195,
    badge: 'Легкое',
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&q=80&w=600',
    category: 'mangal'
  }, */
  {
    id: 114,
    name: 'Шашлык из баранины',
    description: 'Классический кавказский шашлык из отборной мякоти молодого барашка со специями.',
    price: 175,
    badge: 'Премиум',
    image: 'baranina-makot.jpg',
    category: 'mangal'
  }, /*
  {
    id: 124,
    name: 'Шашлык из баранины "семечки"',
    description: 'Нежные бараньи ребрышки на мангале.',
    price: 155,
    badge: null,
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=600',
    category: 'mangal'
  }, */
  {
    id: 113,
    name: 'Шашлык из баранины пистолетики',
    description: 'Изысканные бараньи каре на углях.',
    price: 215,
    badge: 'Премиум',
    image: 'baranina-pistol.jpg',
    category: 'mangal'
  }, /*
  {
    id: 123,
    name: 'Шашлык из телятины по-бакински',
    description: 'Сочная телятина, приготовленная по традиционному рецепту.',
    price: 199,
    badge: 'Хит',
    image: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?auto=format&fit=crop&q=80&w=600',
    category: 'mangal'
  }, */
  {
    id: 115,
    name: 'Люля говяжьи',
    description: 'Традиционное восточное блюдо из рубленого мяса с пряными специями, зажаренное до золотистой корочки.',
    price: 145,
    badge: null,
    image: 'lula-swininagov.jpg',
    category: 'mangal'
  },
  {
    id: 116,
    name: 'Люля куриные',
    description: 'Сочный и мягкий люля из рубленого куриного филе с добавлением сливочного масла и зелени.',
    price: 125,
    badge: null,
    image: 'lula-curiza.jpg',
    category: 'mangal'
  },
  {
    id: 117,
    name: 'Люля свино-говяжий',
    description: 'Ароматный рубленый люля из свинины и говядины.',
    price: 125,
    badge: null,
    image: 'lula-swininagov.jpg',
    category: 'mangal'
  },
  {
    id: 118,
    name: 'Люля свиные',
    description: 'Нежный рубленый люля из сочной свинины.',
    price: 110,
    badge: null,
    image: 'lula-swininagov.jpg',
    category: 'mangal'
  }, /*
  {
    id: 119,
    name: 'Люля картофельные',
    description: 'Картофельный люля-кебаб, запеченный на мангале.',
    price: 85,
    badge: 'Вег',
    image: 'https://images.unsplash.com/photo-1505253716362-af19349e5d43?auto=format&fit=crop&q=80&w=600',
    category: 'mangal'
  },
  {
    id: 120,
    name: 'Люля картофельные с сыром',
    description: 'Картофельный люля с добавлением тягучего сыра.',
    price: 95,
    badge: 'Вег',
    image: 'https://images.unsplash.com/photo-1505253716362-af19349e5d43?auto=format&fit=crop&q=80&w=600',
    category: 'mangal'
  }, */
  {
    id: 121,
    name: 'Форель речная',
    description: 'Сочная речная форель, запеченная на углях. Подается с долькой лимона.',
    price: 170,
    badge: 'Хит',
    image: 'forel1.jpg',
    category: 'mangal'
  },
  {
    id: 122,
    name: 'Стейк из семги (Лосось стейк)',
    description: 'Сочный стейк из красной рыбы, обжаренный на углях. Подается с долькой лимона.',
    price: 299,
    badge: 'Премиум',
    image: 'losos.jpg',
    category: 'mangal'
  },
  {
    id: 125,
    name: 'Купаты',
    description: 'Сочные домашние купаты с пряными травами и специями.',
    price: 125,
    badge: null,
    image: 'cupati.jpg',
    category: 'mangal'
  },
  {
    id: 127,
    name: 'Шампиньоны на мангале (Грибы)',
    description: 'Крупные шляпки свежих шампиньонов, запеченные с дымком.',
    price: 120,
    badge: 'Вег',
    image: 'gribi.jpg',
    category: 'mangal'
  },
  {
    id: 128,
    name: 'Аджапсандал (Хоровац)',
    description: 'Овощи на мангале, приготовленные в виде салата.',
    price: 110,
    badge: null,
    image: 'adzap.jpg',
    category: 'mangal'
  },/*
  {
    id: 129,
    name: 'Овощи гриль',
    description: 'Овощи-гриль в ассортименте.',
    price: 95,
    badge: null,
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=600',
    category: 'mangal'
  },
  {
    id: 130,
    name: 'Картофель молодой с салом/курдюком',
    description: 'Молодой картофель, запеченный до румяной корочки с сало/курдюком.',
    price: 95,
    badge: 'Сытно',
    image: 'https://images.unsplash.com/photo-1505253716362-af19349e5d43?auto=format&fit=crop&q=80&w=600',
    category: 'mangal'
  }, /*
  {
    id: 131,
    name: 'Картофель с салом',
    description: 'Запеченный картофель с кусочками сала.',
    price: 70,
    badge: 'Сытно',
    image: 'https://images.unsplash.com/photo-1505253716362-af19349e5d43?auto=format&fit=crop&q=80&w=600',
    category: 'mangal'
  }, 
  {
    id: 132,
    name: 'Перепелки',
    description: 'Нежные перепелки на мангале.',
    price: 195,
    badge: 'Премиум',
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&q=80&w=600',
    category: 'mangal'
  }, 
  {
    id: 133,
    name: 'Печень баранья в бараньей сетке',
    description: 'Сочная баранья печень в сетке на углях.',
    price: 135,
    badge: null,
    image: 'peshen-v-setke.png',
    category: 'mangal'
  }, */
  {
    id: 134,
    name: 'Печень в сетке (свиная/говяжья)',
    description: 'Нежная печень в жировой сетке, приготовленная на мангале.',
    price: 125,
    badge: null,
    image: 'pechen1.jpg',
    category: 'mangal'
  }, /*
  {
    id: 135,
    name: 'Печень говяжья с салом/курдюком',
    description: 'Говяжья печень на шампуре с добавлением сала.',
    price: 125,
    badge: null,
    image: 'pechen1.jpg',
    category: 'mangal'
  }, 
  {
    id: 136,
    name: 'Почки бараньи',
    description: 'Пикантные бараньи почки на углях.',
    price: 99,
    badge: null,
    image: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?auto=format&fit=crop&q=80&w=600',
    category: 'mangal'
  },
  {
    id: 137,
    name: 'Сердечки бараньи',
    description: 'Нежные бараньи сердечки, приготовленные на мангале.',
    price: 99,
    badge: null,
    image: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?auto=format&fit=crop&q=80&w=600',
    category: 'mangal'
  }, 
  {
    id: 138,
    name: 'Рёбрышки говяжьи',
    description: 'Хрустящие говяжьи рёбрышки на углях.',
    price: 110,
    badge: null,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600',
    category: 'mangal'
  }, /*
  {
    id: 139,
    name: 'Язык бараний',
    description: 'Изысканный деликатес на мангале.',
    price: 165,
    badge: 'Премиум',
    image: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?auto=format&fit=crop&q=80&w=600',
    category: 'mangal'
  },
  {
    id: 140,
    name: 'Язык свиной',
    description: 'Нежный свиной язык, запеченный на углях.',
    price: 125,
    badge: null,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600',
    category: 'mangal'
  } */
 
];  

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
const ProductCard = ({ product, onAddToCart }) => {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedAddon, setSelectedAddon] = useState(PIZZA_ADDONS[0]);

  const basePrice = product.variants ? product.variants[selectedVariant].price : product.price;
  const currentPrice = basePrice + selectedAddon.price;

  const handleAdd = () => {
    onAddToCart(
      product, 
      product.variants ? selectedVariant : null, 
      selectedAddon.id ? [selectedAddon] : []
    );
    setSelectedAddon(PIZZA_ADDONS[0]);
  };

  return (
    <div className="bg-white rounded-2xl p-4 flex flex-col h-full shadow-sm hover:shadow-lg transition-all duration-300 relative group">
      <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-gray-100">
        <img src={product.image} alt={product.name} className="object-conver w-full h-full" />
        {product.badge && (
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
                const found = PIZZA_ADDONS.find(a => a.id === e.target.value);
                setSelectedAddon(found);
              }}
              className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#FF6900] text-gray-800 font-medium cursor-pointer shadow-sm"
            >
              {PIZZA_ADDONS.map(addon => (
                <option key={addon.id} value={addon.id}>
                  {addon.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
          <span className="text-xl font-extrabold text-gray-900">{currentPrice} ₽</span>
          <button 
            onClick={handleAdd}
            className="bg-[#FFF4ED] text-[#FF6900] hover:bg-[#FF6900] hover:text-white transition font-semibold px-5 py-2 rounded-xl text-sm"
          >
            Выбрать
          </button>
        </div>
      </div>
    </div>
  );
};
// Сетка товаров
const ProductGrid = ({ title, products, onAddToCart }) => {
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

// Компонент Корзины (Модальное окно)
const CartModal = ({ isOpen, onClose, cartItems, setCartItems }) => {
  if (!isOpen) return null;

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Шапка корзины */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Ваш заказ</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Список товаров */}
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
                  {((item.category === 'mangal' || item.category === 'salads' || item.category === 'hot' || item.category === 'garnish') && !item.variants) && (
                    <p className="text-xs text-gray-500 mt-0.5">за 100 г</p>
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
            <a 
              href="tel:89624010210"
              className="w-full bg-[#FF6900] hover:bg-[#E05B00] transition-colors text-white py-3.5 rounded-xl font-bold text-lg flex justify-center items-center gap-2 shadow-lg shadow-orange-500/30"
            >
              <Phone className="w-5 h-5" />
              Позвонить и заказать
            </a>
            <p className="text-center text-xs text-gray-400 mt-3">
              Продиктуйте оператору состав вашей корзины
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Главный компонент приложения
export default function App() {
  const [activeCategory, setActiveCategory] = useState('pizza');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (product, selectedVariantIndex) => {
    setCartItems(prev => {
      const hasVariants = !!product.variants;
      const price = hasVariants ? product.variants[selectedVariantIndex].price : product.price;
      const variantLabel = hasVariants ? product.variants[selectedVariantIndex].label : null;
      const cartItemId = hasVariants ? `${product.id}-${selectedVariantIndex}` : product.id;

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
        quantity: 1
      }];
    });
  };

  const displayedProducts = useMemo(() => {
    return MENU_DATA.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  const categoryTitle = CATEGORIES.find(c => c.id === activeCategory)?.label || 'Меню';

  return (
    <div className="bg-[#F9FAFB] min-h-screen font-sans flex flex-col">
      <Header 
        cartItems={cartItems} 
        onOpenCart={() => setIsCartOpen(true)}
      />
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

      {/* Лента вертикальных видео на всех вкладках */}
      <ReelsSection />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {displayedProducts.length > 0 ? (
          <ProductGrid 
            title={categoryTitle} 
            products={displayedProducts} 
            onAddToCart={handleAddToCart}
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
      />
    </div>
  );
}