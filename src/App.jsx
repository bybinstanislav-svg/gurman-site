// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { Phone, Clock, MapPin, ChevronRight, Menu, ShoppingCart, X, Minus, Plus, Trash2 } from 'lucide-react';

// 1. Мок-данные меню (с поддержкой image, badge и variants для всех разделов)
const MENU_DATA = [
  // --- ПИЦЦА ---
  {
    id: 1,
    name: 'ГУРМАН',
    description: 'Томатный соус, ветчина, бекон, охотничьи колбаски, помидоры, моцарелла, зелень',
    price: 359,
    variants: [
      { label: 'Кусочек', price: 77 },
      { label: '20 см', price: 359 },
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
      { label: 'Кусочек', price: 82 },
      { label: '20 см', price: 289 },
      { label: '30 см', price: 635 }
    ],
    badge: 'Популярное',
    image: 'pepperoni.png',
    category: 'pizza'
  },
  {
    id: 3,
    name: '4 сыра',
    description: 'Пармезан, маасдам, чедер, много моцареллы, дор блю чесночное масло',
    price: 249,
    variants: [
      { label: 'Кусочек', price: 90 },
      { label: '20 см', price: 249 },
      { label: '30 см', price: 725 }
    ],
    badge: null,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=600',
    category: 'pizza'
  },
  {
    id: 4,
    name: 'Вашенгтон',
    description: 'Колбаса варена копченая, помидоры, перец болгарский, майонез, моцарелла, фирменный томатный соус',
    price: 389,
    variants: [
      { label: 'Кусочек', price: 75 },
      { label: '20 см', price: 389 },
      { label: '30 см', price: 595 }
    ],
    badge: 'Новинка',
    image: 'washengton.png',
    category: 'pizza'
  },
  {
    id: 31,
    name: 'Гавайская',
    description: 'Сочные ананасы, колбаса варена копченая, фирменный томатный соус, моцареллы',
    price: 299,
    variants: [
      { label: 'Кусочек', price: 79 },
      { label: '20 см', price: 299 },
      { label: '30 см', price: 499 }
    ],
    badge: null,
    image: 'gawai.png',
    category: 'pizza'
  },
  {
    id: 32,
    name: 'Мясная',
    description: 'Цыпленок, ветчина, пикантная пепперони, острые колбаски чоризо, моцарелла, фирменный томатный соус',
    price: 399,
    variants: [
      { label: 'Кусочек', price: 99 },
      { label: '20 см', price: 399 },
      { label: '30 см', price: 599 }
    ],
    badge: 'Хит',
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&q=80&w=600',
    category: 'pizza'
  },
  {
    id: 33,
    name: 'Дьявол',
    description: 'Томатный соус, салями, охотничьи колбаски, острый перчик, лук, моцарелла',
    price: 349,
    variants: [
      { label: 'Кусочек', price: 89 },
      { label: '20 см', price: 349 },
      { label: '30 см', price: 539 }
    ],
    badge: 'Острая',
    image: 'diablo.png',
    category: 'pizza'
  },
  {
    id: 34,
    name: 'Цезарь',
    description: 'Чесночное масло, курочка, моцарелла, помидоры, соус ранч, салат листовой',
    price: 269,
    variants: [
      { label: 'Кусочек', price: 70 },
      { label: '20 см', price: 215 },
      { label: '30 см', price: 535 }
    ],
    badge: null,
    image: 'cezar.png',
    category: 'pizza'
  },
  {
    id: 35,
    name: 'Жульен',
    description: 'Куриное филе, шампиньоны, насыщенный грибной соус, сыр моцарелла',
    price: 329,
    variants: [
      { label: 'Кусочек', price: 75 },
      { label: '20 см', price: 329 },
      { label: '30 см', price: 595 }
    ],
    badge: 'Новинка',
    image: 'zulen.png',
    category: 'pizza'
  },
  {
    id: 36,
    name: 'Барбекю',
    description: 'Сочная ветчина, бекон, соус барбекю, болгарский перец, томаты, сыр моцарелла',
    price: 369,
    variants: [
      { label: 'Кусочек', price: 84 },
      { label: '20 см', price: 369 },
      { label: '30 см', price: 655 }
    ],
    badge: null,
    image: 'bbq.png',
    category: 'pizza'
  },
  {
    id: 37,
    name: 'Вегетарианская',
    description: 'Томаты, сладкий перец, шампиньоны, маслины, красный лук, фирменный томатный соус, брынза и моцарелла',
    price: 279,
    variants: [
      { label: 'Кусочек', price: 75 },
      { label: '20 см', price: 279 },
      { label: '30 см', price: 479 }
    ],
    badge: 'Легкая',
    image: 'https://images.unsplash.com/photo-1576458088443-04a19bb13da6?auto=format&fit=crop&q=80&w=600',
    category: 'pizza'
  },
  {
    id: 38,
    name: 'Морская',
    description: 'Большая порция креветок, фирминый соус, моцарелла, чесночное масло, перец болгарский',
    price: 459,
    variants: [
      { label: 'Кусочек', price: 120 },
      { label: '30 см', price: 699 }
    ],
    badge: 'Премиум',
    image: 'https://images.unsplash.com/photo-1555072956-7758afb20e8f?auto=format&fit=crop&q=80&w=600',
    category: 'pizza'
  },
  {
    id: 39,
    name: 'Чиз Карбонара',
    description: 'Бекон, курица, томат, моцарелла, сырный соус, хрустящий лук',
    price: 339,
    variants: [
      { label: 'Кусочек', price: 75 },
      { label: '20 см', price: 335 },
      { label: '30 см', price: 595 }
    ],
    badge: null,
    image: 'chiz-carbonara.png',
    category: 'pizza'
  },
  {
    id: 40,
    name: 'Охотничья',
    description: 'Томатный соус, салями, охотничьи колбаски, бекон, острый перчик, маринованные огурчики, грибы, моцарелла',
    price: 319,
    variants: [
      { label: 'Кусочек', price: 85 },
      { label: '20 см', price: 330 },
      { label: '30 см', price: 755 }
    ],
    badge: 'Острая',
    image: 'ohotnichia.png',
    category: 'pizza'
  },

  // --- ФАСТ ФУД ---
  {
    id: 5,
    name: 'Гриль бургер с говядиной',
    description: 'Сочная говяжья котлета, 2 ломтика чеддера, салат айсберг, помидоры, соленые огурчики, лук, фирменный соус гриль',
    price: 199,
    badge: 'Хит продаж',
    image: 'gril.png',
    category: 'fastfood'
  },
  {
    id: 6,
    name: 'Чикенбургер с куриной котлетой',
    description: 'Хрустящая куриная котлета, салат, помидоры,огурец соленый, соус ранч, сырный соус',
    price: 179,
    badge: null,
    image: 'chicen-burger.png',
    category: 'fastfood'
  },
  {
    id: 7,
    name: 'Фреш ролл',
    description: 'Пшеничная лепешка, куриное филе, салат айсберг, томаты, огурец свежий, соус ранч',
    price: 195,
    badge: null,
    image: 'fresh-roll.png',
    category: 'fastfood'
  },
  {
    id: 51,
    name: 'Чизбургер',
    description: 'Говяжья котлета, сыр чеддер, маринованные огурчики, кетчуп, горчица на карамелизованной булочке.',
    price: 159,
    badge: null,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=600',
    category: 'fastfood'
  },
  {
    id: 52,
    name: 'Ролл мясной',
    description: 'СуПеР МяСнОй ролл в пшеничной лепёшке с сырам чеддер и нежной моцареллой, томатами, пепперони и куриным фаршем под знакомым соусом гриль с дымком!',
    price: 249,
    badge: 'Хит',
    image: 'mysnoy2.jpg',
    category: 'fastfood'
  },
  {
    id: 53,
    name: 'Ролл Сырный с курицой',
    description: 'Лепешка пшеничная, моцарелла, филе куриное, жареный лучок, помидоры, сырный соус',
    price: 119,
    badge: null,
    image: 'syrniy-roll.jpg',
    category: 'fastfood'
  },
  {
    id: 54,
    name: 'Сырные палочки',
    description: 'Тянущийся сыр моцарелла в хрустящей панировке, обжаренный во фритюре.',
    price: 169,
    badge: 'К пиву',
    image: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?auto=format&fit=crop&q=80&w=600',
    category: 'fastfood'
  },
  {
    id: 55,
    name: 'Картофель фри',
    description: 'Золотистая, хрустящая снаружи и мягкая внутри картошка фри с солью.',
    price: 99,
    badge: 'Топ',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&q=80&w=600',
    category: 'fastfood'
  },
  {
    id: 56,
    name: 'Картофель по-деревенски',
    description: 'Крупные дольки картофеля со специями, обжаренные до румяной корочки.',
    price: 129,
    badge: null,
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed35a47a?auto=format&fit=crop&q=80&w=600',
    category: 'fastfood'
  },
  {
    id: 57,
    name: 'Ролл дракон',
    description: 'Сыр, охотничьи колбаски, маринованные огурчики и перчик халапеньо с барбекю соусом в зажаристой пшеничной лепешке.',
    price: 139,
    badge: null,
    image: 'dracon.jpg',
    category: 'fastfood'
  },
  {
    id: 58,
    name: 'Шаурма с курицей',
    description: 'Обжаренное куриное филе, свежие овощи, фирменный чесночный соус, завернутые в тонкий лаваш.',
    price: 199,
    badge: 'Сытно',
    image: 'https://images.unsplash.com/photo-1647414966952-4eb2e5d16dd0?auto=format&fit=crop&q=80&w=600',
    category: 'fastfood'
  },
  {
    id: 59,
    name: 'Гиро с курицой',
    description: 'Сочная курица, картофель фри, капуста, томаты, огурцы, пикантный соус.',
    price: 219,
    badge: null,
    image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&q=80&w=600',
    category: 'fastfood'
  },
  {
    id: 60,
    name: 'Хот-дог классический',
    description: 'Мясная сосиска в мягкой булочке с кетчупом, горчицей и хрустящим луком.',
    price: 130,
    badge: null,
    image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&q=80&w=600',
    category: 'fastfood'
  },
  {
    id: 61,
    name: 'Френч-дог',
    description: 'Обжаренная сосиска в закрытой французской булочке с соусом.',
    price: 140,
    badge: null,
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=600',
    category: 'fastfood'
  },
  {
    id: 62,
    name: 'Клаб-сэндвич с ветчиной',
    description: 'Поджаренный тостовый хлеб, ветчина, сыр, листья салата, помидоры, майонез.',
    price: 165,
    badge: null,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=600',
    category: 'fastfood'
  },
  {
    id: 63,
    name: 'Сэндвич с курицей',
    description: 'Нежное куриное филе, сыр, свежие овощи и легкий соус в хрустящем хлебе.',
    price: 115,
    badge: null,
    image: 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?auto=format&fit=crop&q=80&w=600',
    category: 'fastfood'
  },
  {
    id: 64,
    name: 'Острые крылышки (5 шт)',
    description: 'Куриные крылышки в пикантной острой панировке. Осторожно, очень остро!',
    price: 199,
    badge: 'Острое',
    image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&q=80&w=600',
    category: 'fastfood'
  },
  {
    id: 65,
    name: 'Куриные стрипсы (4 шт)',
    description: 'Длинные кусочки куриного филе в хрустящей оригинальной панировке.',
    price: 169,
    badge: null,
    image: 'https://images.unsplash.com/photo-1569691899455-88464f6d3ab1?auto=format&fit=crop&q=80&w=600',
    category: 'fastfood'
  },
  {
    id: 66,
    name: 'Кесадилья с курицей',
    description: 'Мексиканская лепешка с начинкой из курицы, сыра, овощей и соуса сальса, обжаренная на гриле.',
    price: 239,
    badge: 'Новинка',
    image: 'https://images.unsplash.com/photo-1618040996337-56858e98bc36?auto=format&fit=crop&q=80&w=600',
    category: 'fastfood'
  },
  {
    id: 67,
    name: 'Бургер Барбекю',
    description: 'Говяжья котлета, бекон, сыр чеддер, салат, томаты, хрустящий лук и соус BBQ.',
    price: 249,
    badge: null,
    image: 'https://images.unsplash.com/photo-1594212848116-b8db5d858f96?auto=format&fit=crop&q=80&w=600',
    category: 'fastfood'
  },
  {
    id: 68,
    name: 'Фишбургер',
    description: 'Нежное филе белой рыбы в панировке, сыр чеддер, салат айсберг и соус тартар.',
    price: 189,
    badge: null,
    image: 'https://images.unsplash.com/photo-1615865417482-15f2125ce09b?auto=format&fit=crop&q=80&w=600',
    category: 'fastfood'
  },
  {
    id: 69,
    name: 'Сырный бургер',
    description: 'Для фанатов сыра: котлета из говядины, сырная котлета, соус сырный, чеддер.',
    price: 279,
    badge: null,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&q=80&w=600',
    category: 'fastfood'
  },
  {
    id: 70,
    name: 'Картофель фри (большой)',
    description: 'Большая порция хрустящего золотистого картофеля фри. Идеально для компании.',
    price: 149,
    badge: null,
    image: 'https://images.unsplash.com/photo-1630431341973-02e1b662ce2b?auto=format&fit=crop&q=80&w=600',
    category: 'fastfood'
  },

  // --- САЛАТЫ ---
  { 
    id: 101,
    name: 'Салат Крабовые палочки с ананасом',
    description: 'Нежный салат из крабовых палочек с сочными ананасами',
    price: 49,
    badge: 'Хит',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600',
    category: 'salads'
  },
  { 
    id: 102, 
    name: 'Салат "Жозефина"', 
    description: 'Фирменный салат от шефа', 
    price: 58, 
    barge: null, 
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 103, 
    name: 'Салат Печень куриная с солеными грибами', 
    description: 'Сытный салат с куриной печенью и ароматными грибочками', 
    price: 57, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  {
     id: 104, 
     name: 'Салат "Из свежей моркови с сыром"', 
     description: 'Легкий и витаминный салат', 
     price: 33, 
     badge: null, 
     image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&q=80&w=600', 
     category: 'salads' 
    },
  { 
    id: 105, 
    name: 'Фасоль с жареными грибами и сыром', 
    description: 'Пикантное сочетание фасоли, грибов и сыра', 
    price: 63, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 106, 
    name: 'Салат "Фестиваль"', 
    description: 'Яркий и вкусный салат', 
    price: 47, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 107, 
    name: 'Салат "Мозаика"', 
    description: 'Разнообразие вкусов в одном блюде', 
    price: 52, badge: null, 
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 108, 
    name: 'Салат "Парус"', 
    description: 'Классический популярный салат', 
    price: 42, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 109, 
    name: 'Салат "Россия"', 
    description: 'Традиционные ингредиенты и прекрасный вкус', 
    price: 39, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 110, 
    name: 'Салат "Из печени трески"', 
    description: 'Изысканный салат с богатым вкусом', 
    price: 73, 
    badge: 'Популярное', 
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 111, 
    name: 'Салат "Невод"', 
    description: 'С дарами моря', 
    price: 95, 
    badge: 'Премиум', 
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 112, 
    name: 'Салат "Фурор"', 
    description: 'Произведет фурор за вашим столом', 
    price: 49, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 113, 
    name: 'Салат "Хрустантик"', 
    description: 'Хрустящий и освежающий салат', 
    price: 62, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 114, 
    name: 'Салат "Из ветчины и картофеля"',
    description: 'Сытный домашний салат', 
    price: 39, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 115, 
    name: 'Салат "Легкий"', 
    description: 'Ничего лишнего, только свежесть', 
    price: 54, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    d: 116, 
    name: 'Салат "Перекус"', 
    description: 'Отличный вариант для быстрого перекуса', price: 57, 
    badge: null, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 117, 
    name: 'Салат "Дачница"', 
    description: 'Летний вкус круглый год', 
    price: 55, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 118, 
    name: 'Салат с куриной печенью, грибами и помидорами', 
    description: 'Изысканное сочетание компонентов', 
    price: 40, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 119, 
    name: 'Салат "С копченым мясом и овощами"', 
    description: 'С ярким копченым ароматом', 
    price: 59, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 120, 
    name: 'Салат "Гости на пороге"', 
    description: 'Быстро, сытно и очень вкусно', 
    price: 45, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 121, 
    name: 'Салат из кальмаров', 
    description: 'Нежные кусочки кальмаров с отборными ингредиентами', 
    price: 82, 
    badge: 'Хит', 
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 122, 
    name: 'Салат с куриным филе, кукурузой и яблоком', 
    description: 'Оригинальное кисло-сладкое сочетание', 
    price: 54, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 123, 
    name: 'Салат "Изысканный"', 
    description: 'Для ценителей утонченных вкусов', 
    price: 30, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 124, 
    name: 'Салат "Полосатик"', 
    description: 'Красивая подача и отменный вкус', 
    price: 66, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 125, 
    name: 'Салат с крабовыми палочками, зеленью и огурцом', 
    description: 'Свежий и легкий салат', 
    price: 54, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 126, 
    name: 'Салат "Дворянский"', 
    description: 'Богатый состав и великолепный вкус', 
    price: 75, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 127, 
    name: 'Салат с креветками и гребешками', 
    description: 'Премиальный морской салат', 
    price: 68, 
    badge: 'Премиум', 
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  {
    id: 128, 
    name: 'Салат из куриного филе с фасолью', 
    description: 'Сытный белковый салат', 
    price: 52, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 129, 
    name: 'Салат из пекинской капусты с копченой курицей', 
    description: 'Нежная пекинская капуста с копченой курочкой', 
    price: 55, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },
  { 
    id: 130, 
    name: 'Салат "С свежим огурцом и редисом"', 
    description: 'Весенняя свежесть на вашем столе', 
    price: 39, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600', 
    category: 'salads' 
  },

  // --- ГОРЯЧИЕ БЛЮДА ---
  { 
    id: 201, 
    name: 'Плов из курицы', 
    description: 'Рассыпчатый рис с сочной курицей и восточными специями', 
    price: 40, 
    badge: 'Хит', 
    image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&q=80&w=600', 
    category: 'hot' 
  },
  { 
    id: 202, 
    name: 'Плов из утки', 
    description: 'Ароматный плов с нежным мясом утки', 
    price: 65, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&q=80&w=600', 
    category: 'hot' 
  },
  { 
    id: 203, 
    name: 'Вареники по-домашнему в ассорт.', 
    description: 'Традиционные домашние вареники', 
    price: 18, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=600', 
    category: 'hot' 
  },
  { 
    id: 204, 
    name: 'Омлет в ассорт.', 
    description: 'Пышный и нежный омлет', 
    price: 44, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&q=80&w=600', 
    category: 'hot' 
  },
  { 
    id: 205, 
    name: 'Печеночный торт', 
    description: 'Слоистый нежный печеночный торт с прослойкой', 
    price: 65, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600', 
    category: 'hot' 
  },
  { 
    id: 206, 
    name: 'Плов из свинины', 
    description: 'Сытный плов с отборной свининой', 
    price: 65, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&q=80&w=600', 
    category: 'hot' 
  },
  { 
    id: 207, 
    name: 'Запеканка из блинчиков', 
    description: 'Сладкая или сытная запеканка из румяных блинчиков', 
    price: 55, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=600', 
    category: 'hot' 
  },
  { 
    id: 208, 
    name: 'Котлета по-княжески', 
    description: 'Фирменная сочная котлета', 
    price: 67, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&q=80&w=600', 
    category: 'hot'
  },
  { 
    id: 209, 
    name: 'Язык говяжий отварной', 
    description: 'Нежнейший деликатесный отварной язык', 
    price: 125, 
    badge: 'Премиум', 
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=600', 
    category: 'hot' 
  },
  { 
    id: 210, 
    name: 'Бифштекс с грибами', 
    description: 'Сочный бифштекс под грибным соусом', 
    price: 65, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1544025162-83141f2389d4?auto=format&fit=crop&q=80&w=600', 
    category: 'hot' 
  },
  { 
    id: 211, 
    name: 'Говядина тушеная с луком', 
    description: 'Мягкие кусочки говядины в подливке', 
    price: 125, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=600', 
    category: 'hot' 
  },
  { 
    id: 212, 
    name: 'Шницель по-деревенски', 
    description: 'Хрустящий шницель из отборного мяса', 
    price: 64, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&q=80&w=600', 
    category: 'hot' 
  },
  { 
    id: 213, 
    name: 'Печень куриная в сметане', 
    description: 'Куриная печень в мягком сметанном соусе', 
    price: 45, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600', 
    category: 'hot' 
  },
  { 
    id: 214, 
    name: 'Печень по-строгановски', 
    description: 'Классическое блюдо с подливкой', 
    price: 65, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600', 
    category: 'hot' 
  },
  { 
    id: 215, 
    name: 'Азу по-татарски', 
    description: 'Традиционное остро-пряное блюдо', 
    price: 85, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=600', 
    category: 'hot' 
  },

  // --- ГАРНИРЫ ---
  { 
    id: 301, 
    name: 'Картофель жареный с грибами', 
    description: 'Ароматный картофель с жареными грибочками', 
    price: 39, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1626200926732-475253272990?auto=format&fit=crop&q=80&w=600', 
    category: 'garnish' 
  },
  { 
    id: 302, 
    name: 'Кабачки жареные с чесноком', 
    description: 'Нежные кабачки с пикантным чесночным ароматом', 
    price: 29, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=600', 
    category: 'garnish' 
  },
  { 
    id: 303, 
    name: 'Отварной картофель с укропом', 
    description: 'Классический отварной картофель со сливочным маслом и зеленью', 
    price: 39, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1626200926732-475253272990?auto=format&fit=crop&q=80&w=600', 
    category: 'garnish' 
  },
  {
    id: 304, 
    name: 'Картофель "Айдахо"', 
    description: 'Дольки картофеля в кожуре со специями', 
    price: 33, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&q=80&w=600', 
    category: 'garnish' 
  },
  { 
    id: 305, 
    name: 'Гарнир "Из Перловки"', 
    description: 'Полезная и питательная перловая крупа', 
    price: 19, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d4490c?auto=format&fit=crop&q=80&w=600', 
    category: 'garnish' 
  },
  { 
    id: 306, 
    name: 'Гарнир "Булгур с овощами"', 
    description: 'Булгур с добавлением сочных овощей', 
    price: 44, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d4490c?auto=format&fit=crop&q=80&w=600', 
    category: 'garnish' 
  },
  { 
    id: 307, 
    name: 'Гарнир "Рис с грибами"', 
    description: 'Рассыпчатый рис с обжаренными грибами', 
    price: 39, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d4490c?auto=format&fit=crop&q=80&w=600', 
    category: 'garnish' 
  },
  { 
    id: 308, 
    name: 'Гарнир "Рис"', 
    description: 'Классический рисовый гарнир', 
    price: 20, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d4490c?auto=format&fit=crop&q=80&w=600', 
    category: 'garnish' 
  },
  { 
    id: 309, 
    name: 'Фасоль по-грузински', 
    description: 'Пикантная фасоль со специями и зеленью', 
    price: 20, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600', 
    category: 'garnish' 
  },
  { 
    id: 310, 
    name: 'Картофель запеченный', 
    description: 'Запеченный до золотистой корочки картофель', 
    price: 17, 
    badge: null, 
    image: 'https://images.unsplash.com/photo-1626200926732-475253272990?auto=format&fit=crop&q=80&w=600', 
    category: 'garnish' 
  },

  // --- МАНГАЛ ---
  {
    id: 8,
    name: 'Шашлык из свиной шеи',
    description: 'Сочные кусочки отборной свиной шеи, маринованные по фирменному рецепту и обжаренные на углях. Подается с луком.',
    price: 190,
    badge: 'Хит продаж',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600',
    category: 'mangal'
  },
  {
    id: 9,
    name: 'Шашлык из курицы',
    description: 'Нежное куриное филе со специями, приготовленное на мангале. Диетический и очень вкусный выбор.',
    price: 160,
    badge: null,
    image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&q=80&w=600',
    category: 'mangal'
  },
  {
    id: 10,
    name: 'Люля-кебаб из говядины',
    description: 'Традиционное восточное блюдо из рубленого мяса с пряными специями, зажаренное до золотистой корочки.',
    price: 210,
    badge: null,
    image: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?auto=format&fit=crop&q=80&w=600',
    category: 'mangal'
  },
  {
    id: 41,
    name: 'Шашлык из баранины',
    description: 'Классический кавказский шашлык из отборной мякоти молодого барашка со специями.',
    price: 280,
    badge: 'Премиум',
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=600',
    category: 'mangal'
  },
  {
    id: 42,
    name: 'Свиные ребрышки барбекю',
    description: 'Сочные свиные ребрышки, запеченные на огне в густом и сладковатом соусе барбекю.',
    price: 220,
    badge: 'Хит',
    image: 'https://images.unsplash.com/photo-1544025162-83141f2389d4?auto=format&fit=crop&q=80&w=600',
    category: 'mangal'
  },
  {
    id: 43,
    name: 'Люля-кебаб из баранины',
    description: 'Рубленая баранина с курдючным жиром, репчатым луком и традиционными восточными пряностями.',
    price: 240,
    badge: null,
    image: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&q=80&w=600',
    category: 'mangal'
  },
  {
    id: 44,
    name: 'Куриные крылышки на углях',
    description: 'Хрустящие и сочные куриные крылышки, замаринованные в пикантном соусе и обжаренные до золотистой корочки.',
    price: 140,
    badge: 'К пиву',
    image: 'https://images.unsplash.com/photo-1608039755401-742079603f90?auto=format&fit=crop&q=80&w=600',
    category: 'mangal'
  },
  {
    id: 45,
    name: 'Шашлык из индейки',
    description: 'Диетический, невероятно нежный шашлык из филе грудки индейки в легком маринаде.',
    price: 180,
    badge: 'Легкое',
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&q=80&w=600',
    category: 'mangal'
  },
  {
    id: 46,
    name: 'Шампиньоны на мангале',
    description: 'Крупные шляпки свежих шампиньонов, запеченные с дымком в сливочно-чесночном соусе.',
    price: 90,
    badge: 'Вег',
    image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&q=80&w=600',
    category: 'mangal'
  },
  {
    id: 47,
    name: 'Овощи гриль',
    description: 'Сладкий болгарский перец, цукини, баклажаны и томаты черри, приготовленные на решетке с добавлением оливкового масла.',
    price: 110,
    badge: null,
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=600',
    category: 'mangal'
  },
  {
    id: 48,
    name: 'Стейк из семги',
    description: 'Сочный стейк из красной рыбы, обжаренный на углях. Подается с долькой лимона.',
    price: 450,
    badge: 'Премиум',
    image: 'https://images.unsplash.com/photo-1599084990807-35368a41031d?auto=format&fit=crop&q=80&w=600',
    category: 'mangal'
  },
  {
    id: 49,
    name: 'Картофель с салом на шампуре',
    description: 'Молодой картофель, запеченный до румяной корочки вперемешку с ломтиками копченого сала.',
    price: 60,
    badge: 'Сытно',
    image: 'https://images.unsplash.com/photo-1505253716362-af19349e5d43?auto=format&fit=crop&q=80&w=600',
    category: 'mangal'
  },
  {
    id: 50,
    name: 'Люля-кебаб из курицы',
    description: 'Сочный и мягкий кебаб из рубленого куриного филе с добавлением сливочного масла и зелени.',
    price: 160,
    badge: null,
    image: 'https://images.unsplash.com/photo-1603360946369-00a89d4bc8f0?auto=format&fit=crop&q=80&w=600',
    category: 'mangal'
  }
];
// Витрина видео (рилсы) для всех вкладок
const REELS_DATA = [
  {
    id: 1,
    title: 'Сочный шашлык на углях',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-barbecue-with-meat-and-sausages-on-the-grill-41682-large.mp4',
    tag: 'Мангал'
  },
  {
    id: 2,
    title: 'Готовим свежую пиццу',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-preparing-a-pizza-with-ingredients-43187-large.mp4',
    tag: 'Пицца'
  },
  {
    id: 3,
    title: 'Наши фирменные бургеры',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-juicy-hamburger-with-a-lot-of-ingredients-42964-large.mp4',
    tag: 'Фаст Фуд'
  }
];
const CATEGORIES = [
  { id: 'mangal', label: 'Мангал' },
  { id: 'pizza', label: 'Пицца' },
  { id: 'fastfood', label: 'Фаст Фуд' },
  { id: 'hot', label: 'Горячие блюда' },
  { id: 'salads', label: 'Салаты' },
  { id: 'garnish', label: 'Гарниры' }
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
            <div className="bg-[#E33510] text-white p-2 rounded-lg font-bold text-xl tracking-wider">
              ГУРМАН
            </div>
          </div>

          {/* Контакты (скрыты на мобильных) */}
          <div className="hidden md:flex flex-col items-center text-sm">
            <div className="flex items-center text-gray-800 font-bold text-lg">
              <Phone className="w-4 h-4 mr-2 text-[#E33510]" />
              910-210
            </div>
          </div>

          {/* Кнопка Корзины */}
          <button 
            onClick={onOpenCart}
            className="bg-[#E33510] hover:bg-red-700 transition text-white px-4 py-2 rounded-full flex items-center space-x-2 shadow-md ml-4"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 ? (
              <>
                <span className="font-semibold hidden sm:inline">{totalPrice} ₽</span>
                <span className="bg-white text-[#E33510] text-xs font-bold px-2 py-0.5 rounded-full">
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
              className={`whitespace-nowrap font-medium text-sm transition-colors duration-200 px-3 py-1 rounded-full ${
                activeCategory === category.id
                  ? 'bg-gray-100 text-[#E33510]'
                  : 'text-gray-600 hover:text-[#E33510] hover:bg-gray-50'
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
  const currentPrice = product.variants ? product.variants[selectedVariant].price : product.price;

  return (
    <div className="bg-white rounded-2xl p-4 flex flex-col h-full shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 relative group">
      <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name} 
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
        />
        {product.badge && (
          <div className="absolute top-2 left-2 bg-[#E33510] text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
            {product.badge}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 flex-grow leading-relaxed mb-3">
          {product.description}
        </p>
        
        {product.variants && (
          <div className="bg-gray-100 rounded-lg p-1 flex justify-between items-center mb-4 mt-auto">
            {product.variants.map((variant, index) => (
              <button
                key={index}
                onClick={() => setSelectedVariant(index)}
                className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-all duration-200 ${
                  selectedVariant === index
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {variant.label}
              </button>
            ))}
          </div>
        )}

        <div className={`flex justify-between items-center pt-4 border-t border-gray-100 ${!product.variants ? 'mt-auto' : ''}`}>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-gray-900">{currentPrice} ₽</span>
            {(product.category === 'mangal' || product.category === 'salads' || product.category === 'hot' || product.category === 'garnish') && !product.variants && (
              <span className="text-xs text-gray-500 font-medium">за 100 г</span>
            )}
          </div>
          <button 
            onClick={() => onAddToCart(product, product.variants ? selectedVariant : null)}
            className="bg-[#FFF0ED] text-[#E33510] hover:bg-[#E33510] hover:text-white transition-colors duration-300 font-semibold px-5 py-2 rounded-xl"
          >
            Выбрать
          </button>
        </div>
      </div>
    </div>
  );
};

// Сетка товаров
const ProductGrid = ({ title, products, onAddToCart, activeCategory }) => {
  if (products.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">{title}</h2>
      
      // Лента вертикальных видео (рилсы)
const ReelsSection = () => {
  return (
    <div className="mb-10 overflow-x-auto scrollbar-hide py-2">
      <div className="flex space-x-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {REELS_DATA.map((reel) => (
          <div key={reel.id} className="flex-shrink-0 w-[200px] sm:w-[220px] rounded-2xl overflow-hidden shadow-lg bg-black relative aspect-[9/16] group">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
            >
              <source src={reel.videoUrl} type="video/mp4" />
              Ваш браузер не поддерживает видео.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-between p-4">
              <span className="bg-[#E33510] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider w-max">
                {reel.tag}
              </span>
              <h4 className="text-white text-sm font-bold leading-tight">
                {reel.title}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

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
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-[#E33510] text-white p-1.5 rounded font-bold text-lg">
                ГУРМАН
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Готовим для вас с любовью!
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Контакты</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-[#E33510]" />
                910-210
              </li>
              <li className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-[#E33510]" />
                Ежедневно с 8:00 до 22:00
              </li>
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 text-[#E33510] mt-1 shrink-0" />
                с. Александровское ул. Войтика 16Б
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Правовая информация</h3>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>ИП Конотопцев В. А.</li>
              <li>ОГРНИП: 319774600000000</li>
              <li>ИНН: 770000000000</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-xs text-center text-gray-500">
          © {new Date().getFullYear()} Гурман. Все права защищены.
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
                  <p className="font-bold text-[#E33510] mt-1">{item.price} ₽</p>
                </div>
                
                {/* Контролы количества и кнопка удаления */}
                <div className="flex flex-col items-end gap-2">
                  <button 
                    onClick={() => removeItem(item.cartItemId)}
                    className="text-gray-400 hover:text-[#E33510] transition-colors"
                    title="Удалить из корзины"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm">
                    <button 
                      onClick={() => updateQuantity(item.cartItemId, -1)}
                      className="p-1.5 text-gray-500 hover:text-[#E33510] transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-7 text-center font-semibold text-sm text-gray-800">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.cartItemId, 1)}
                      className="p-1.5 text-gray-500 hover:text-[#E33510] transition"
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
              href="tel:910210"
              className="w-full bg-[#E33510] hover:bg-red-700 transition-colors text-white py-3.5 rounded-xl font-bold text-lg flex justify-center items-center gap-2 shadow-lg shadow-red-500/30"
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
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1600" 
            alt="Фон" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start">
          <span className="bg-[#E33510] text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            Супермаркет в Александровском
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 max-w-2xl">
            Готовим с душой каждый день
          </h1>
          <p className="text-lg text-gray-200 mb-8 max-w-xl">
            Пицца, блюда на мангале, фаст фуд, горячие блюда, салаты и гарниры — всё свежее и горячее.
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="tel:910210" 
              className="bg-[#E33510] hover:bg-red-700 text-white font-bold px-6 py-3.5 rounded-xl flex items-center gap-2 transition shadow-lg shadow-red-600/30"
            >
              <Phone className="w-5 h-5" />
              910-210
            </a>
          </div>
        </div>
      </div>
      <CategoryMenu 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
      />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {displayedProducts.length > 0 ? (
          <ProductGrid 
            title={categoryTitle} 
            products={displayedProducts} 
            onAddToCart={handleAddToCart}
            activeCategory={activeCategory}
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