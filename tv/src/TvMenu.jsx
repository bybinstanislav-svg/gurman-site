import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';

// Текст в блоке фиксированной высоты: если не помещается — шрифт плавно уменьшается,
// пока текст не влезет целиком (но не ниже minSize). Благодаря фиксированной высоте блока
// цены во всех карточках стоят на одном уровне.
const FitText = ({ text, boxHeight, baseSize, minSize, scale, lineHeight, fontWeight, color, uppercase, style }) => {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      let s = baseSize;
      el.style.fontSize = `${Math.round(s * scale)}px`;
      let guard = 0;
      while (el.scrollHeight > el.clientHeight + 1 && s > minSize && guard < 60) {
        s -= 0.5;
        el.style.fontSize = `${Math.round(s * scale)}px`;
        guard += 1;
      }
    };
    fit();
    // после загрузки веб-шрифта метрики меняются — подгоняем заново
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fit);
    }
  });
  return (
    <p
      ref={ref}
      style={{
        height: Math.round(boxHeight * scale),
        overflow: 'hidden',
        fontSize: Math.round(baseSize * scale),
        lineHeight,
        fontWeight,
        color,
        margin: 0,
        textTransform: uppercase ? 'uppercase' : 'none',
        overflowWrap: 'break-word',
        ...style,
      }}
    >
      {text}
    </p>
  );
};

export default function TvMenu() {
  // 1. СПИСКИ КАТЕГОРИЙ (оставляем все ваши вкусные позиции)
  const pizzaItems = [
    { name: 'ГУРМАН', description: 'Томатный соус, ветчина, бекон, охотничьи колбаски, помидоры, моцарелла, зелень', variants: [{ label: 'Кусок', price: '77 ₽' }, { label: '20 см', price: '325 ₽' }, { label: '30 см', price: '595 ₽' }], image: '/gurman.png' },
    { name: 'Пепперони', description: 'Пикантная пепперони, увеличенная порция моцареллы, томатный соус', variants: [{ label: 'Кусок', price: '82 ₽' }, { label: '20 см', price: '275 ₽' }, { label: '30 см', price: '635 ₽' }], image: '/pepperoni-pizza.png' },
    { name: '4 сыра', description: 'Пармезан, чедер, много моцареллы, дор блю, чесночное масло', variants: [{ label: 'Кусок', price: '90 ₽' }, { label: '20 см', price: '315 ₽' }, { label: '30 см', price: '725 ₽' }], image: '/4sira-pizza-.png' },
    { name: 'Вашингтон', description: 'Колбаса варена копченая, помидоры, перец болгарский, майонез, моцарелла, фирменный томатный соус', variants: [{ label: 'Кусок', price: '75 ₽' }, { label: '20 см', price: '275 ₽' }, { label: '30 см', price: '595 ₽' }], image: '/washengton.png' },
    { name: 'Гавайская', description: 'Сочные ананасы, колбаса варена копченая, фирменный томатный соус, моцарелла', variants: [{ label: 'Кусок', price: '79 ₽' }, { label: '20 см', price: '315 ₽' }, { label: '30 см', price: '499 ₽' }], image: '/gawai.png' },
    { name: 'Бургер-пицца', description: 'Ветчина, томаты, маринованные огурчики, моцарелла, красный лук, соус бургер, фирменный томатный соус', variants: [{ label: 'Кусок', price: '99 ₽' }, { label: '20 см', price: '275 ₽' }, { label: '30 см', price: '599 ₽' }], image: '/burger-pizza.png' },
    { name: 'Диабло', description: 'Томатный соус, ветчина, пепперони, охотничьи колбаски, острый перчик, лук, моцарелла', variants: [{ label: 'Кусок', price: '77 ₽' }, { label: '20 см', price: '275 ₽' }, { label: '30 см', price: '595 ₽' }], image: '/diablo.png' },
    { name: 'Цезарь', description: 'Чесночное масло, курочка, моцарелла, помидоры, соус ранч, салат листовой', variants: [{ label: 'Кусок', price: '70 ₽' }, { label: '20 см', price: '275 ₽' }, { label: '30 см', price: '535 ₽' }], image: '/cezar.png' },
    { name: 'Жульен', description: 'Куриное филе, шампиньоны, насыщенный грибной соус, сыр моцарелла', variants: [{ label: 'Кусок', price: '75 ₽' }, { label: '20 см', price: '365 ₽' }, { label: '30 см', price: '595 ₽' }], image: '/zulen.png' },
    { name: 'Барбекю', description: 'Сочная ветчина, бекон, соус барбекю, болгарский перец, томаты, сыр моцарелла', variants: [{ label: 'Кусок', price: '84 ₽' }, { label: '20 см', price: '275 ₽' }, { label: '30 см', price: '655 ₽' }], image: '/bbq.png' },
    { name: 'Вегетарианская', description: 'Томаты, сладкий перец, шампиньоны, красный лук, фирменный томатный соус, моцарелла', variants: [{ label: '20 см', price: '235 ₽' }, { label: '30 см', price: '525 ₽' }], image: '/veget1.png' },
    { name: 'Пицца с семгой', description: 'Семга, фирминый соус, моцарелла, томат, маслины, рукола, перец болгарский', variants: [{ label: '30 см', price: '795 ₽' }], image: '/s-semgoi.png' },
    { name: 'Чиз карбонара', description: 'Бекон, курица, томат, моцарелла, сырный соус, хрустящий лук', variants: [{ label: '20 см', price: '365 ₽' }, { label: '30 см', price: '595 ₽' }], image: '/chiz-carbonara.png' },
    { name: 'Охотничья', description: 'Томатный соус, салями, охотничьи колбаски, бекон, острый перчик, маринованные огурчики, грибы, моцарелла', variants: [{ label: '20 см', price: '355 ₽' }, { label: '30 см', price: '755 ₽' }], image: '/ohotnichia.png' },
    { name: 'Мексиканская', description: 'Томатный соус, куриный фарш, томат, лук, острый перчик, моцарелла', variants: [{ label: '20 см', price: '315 ₽' }, { label: '30 см', price: '675 ₽' }], image: '/mexika.png' },
    { name: 'Пицца с морепродуктами', description: 'Томатный соус, тигровые креветки, перец болгарский, моцарелла', variants: [{ label: '30 см', price: '695 ₽' }], image: '/more1.png' }
  ];

  const fastfoodItems = [
    // Бургеры
    { name: 'Гриль бургер с говядиной', description: 'Сочная говяжья котлета, 2 ломтика чеддера, салат айсберг, помидоры, соленые огурчики, лук, фирменный соус гриль', variants: [{ label: 'Цена', price: '295 ₽' }], image: '/gril.png' },
    { name: 'Чикенбургер с куриной котлетой', description: 'Хрустящая куриная котлета, салат, помидоры, огурец соленый, соус ранч, сырный соус', variants: [{ label: 'Цена', price: '235 ₽' }], image: '/chicen-burger.png' },
    { name: 'Бургер Нью Йорк', description: 'Черная булочка, говяжья котлета, сыр чеддер, бекон, лук, огурец соленый, соус сырный, фирменый острый соус', variants: [{ label: 'Цена', price: '295 ₽' }], image: '/negr.png' },
    // Роллы
    { name: 'Фреш ролл', description: 'Пшеничная лепешка, куриное филе, салат айсберг, томаты, огурец свежий, соус ранч', variants: [{ label: 'Цена', price: '195 ₽' }], image: '/roll12.png' },
    { name: 'Ролл мясной', description: 'СуПеР МяСнОй ролл в пшеничной лепёшке с сырам чеддер и нежной моцареллой, томатами, пепперони и куриным фаршем под знакомым соусом гриль с дымком!', variants: [{ label: 'Цена', price: '165 ₽' }], image: '/mysnoy3.png' },
    { name: 'Ролл Сырный с курицой', description: 'Лепешка пшеничная, моцарелла, филе куриное, жареный лучок, помидоры, сырный соус', variants: [{ label: 'Цена', price: '165 ₽' }], image: '/syrniy-roll2.png' },
    { name: 'Ролл дракон', description: 'Сыр, охотничьи колбаски, маринованные огурчики и перчик халапеньо с барбекю соусом в зажаристой пшеничной лепешке.', variants: [{ label: 'Цена', price: '165 ₽' }], image: '/dracon2.png' },
    { name: 'Бурито', description: 'Куриный фарш со специями, огурец, кетчуп, соус ранч, мексиканская лепешка, томат.', variants: [{ label: 'Цена', price: '165 ₽' }], image: '/burito.jpg' },
    // Боксмастер
    { name: 'Боксмастер', description: 'Мексиканская лепешка с начинкой из куриных стрипсов, картофельной котлете, овощей, сырный соус и соус ранч, обжаренная в печи.', variants: [{ label: 'Цена', price: '255 ₽' }], image: '/boxmaster.png' },
    // Сэндвичи и крылья
    { name: 'Сэндвич с ветчиной', description: 'Поджаренный тостовый хлеб, ветчина, сыр, листья салата, помидоры, майонез.', variants: [{ label: 'Цена', price: '165 ₽' }], image: '/send-vetshina.jpg' },
    { name: 'Сэндвич с курицей', description: 'Нежное куриное филе, сыр, свежие овощи и легкий соус в хрустящем хлебе.', variants: [{ label: 'Цена', price: '115 ₽' }], image: '/send-kuriza.jpg' },
    { name: 'Острые крылышки Баффало (5 шт)', description: 'Куриные крылышки в пикантной острой панировке. Осторожно, очень остро!', variants: [{ label: 'Цена', price: '199 ₽' }], image: '/baffalo.png' }
  ];

  const mangalItems = [
    { name: 'Шашлык из свинины (антрекот)', description: 'Кусочки антрекота, маринованные по фирменному рецепту и обжаренные на углях. Подается с луком.', variants: [{ label: 'Цена', price: '155 ₽' }], image: '/antrikot.jpg' },
    { name: 'Шашлык из свинины (шея)', description: 'Сочный и мягкий шашлык из свиной шейки со специями.', variants: [{ label: 'Цена', price: '169 ₽' }], image: '/shey1.jpg' },
    { name: 'Сувлаки свиные', description: 'Мякоть свинины жареная на мангале.', variants: [{ label: 'Цена', price: '169 ₽' }], image: '/suwlak-svinina.jpg' },
    { name: 'Шашлык из куриного филе', description: 'Нежное куриное филе со специями, приготовленное на мангале. Диетический и очень вкусный выбор.', variants: [{ label: 'Цена', price: '155 ₽' }], image: '/suvlak-curiza.jpg' },
    { name: 'Шашлык из куриного бедра', description: 'Сочное куриное бедро на косточке, зажаренное на углях.', variants: [{ label: 'Цена', price: '115 ₽' }], image: '/bedro.jpg' },
    { name: 'Куриные крылья на углях', description: 'Сочные куриные крылышки, замаринованные в пикантном соусе и обжаренные до золотистой корочки.', variants: [{ label: 'Цена', price: '135 ₽' }], image: '/crilo1.jpg' },
    { name: 'Голень куриная', description: 'Куриная голень в пряном маринаде на мангале.', variants: [{ label: 'Цена', price: '115 ₽' }], image: '/golen.jpg' },
    { name: 'Шашлык из баранины', description: 'Классический кавказский шашлык из отборной мякоти молодого барашка со специями.', variants: [{ label: 'Цена', price: '175 ₽' }], image: '/baranina-makot.jpg' },
    { name: 'Шашлык из баранины пистолетики', description: 'Изысканные бараньи каре на углях.', variants: [{ label: 'Цена', price: '215 ₽' }], image: '/baranina-pistol.jpg' },
    { name: 'Люля говяжьи', description: 'Традиционное восточное блюдо из рубленого мяса с пряными специями, зажаренное до золотистой корочки.', variants: [{ label: 'Цена', price: '145 ₽' }], image: '/lula-swininagov.jpg' },
    { name: 'Люля куриные', description: 'Сочный и мягкий люля из рубленого куриного филе с добавлением сливочного масла и зелени.', variants: [{ label: 'Цена', price: '125 ₽' }], image: '/lula-curiza.jpg' },
    { name: 'Люля свино-говяжий', description: 'Ароматный рубленый люля из свинины и говядины.', variants: [{ label: 'Цена', price: '125 ₽' }], image: '/lula-swininagov.jpg' },
    { name: 'Люля свиные', description: 'Нежный рубленый люля из сочной свинины.', variants: [{ label: 'Цена', price: '110 ₽' }], image: '/lula-swininagov.jpg' },
    { name: 'Форель речная', description: 'Сочная речная форель, запеченная на углях. Подается с долькой лимона.', variants: [{ label: 'Цена', price: '170 ₽' }], image: '/forel1.jpg' },
    { name: 'Стейк из семги (Лосось стейк)', description: 'Сочный стейк из красной рыбы, обжаренный на углях. Подается с долькой лимона.', variants: [{ label: 'Цена', price: '299 ₽' }], image: '/losos.jpg' },
    { name: 'Купаты', description: 'Сочные домашние купаты с пряными травами и специями.', variants: [{ label: 'Цена', price: '125 ₽' }], image: '/cupati.jpg' },
    { name: 'Шампиньоны на мангале (Грибы)', description: 'Крупные шляпки свежих шампиньонов, запеченные с дымком.', variants: [{ label: 'Цена', price: '120 ₽' }], image: '/gribi.jpg' },
    { name: 'Аджапсандал (Хоровац)', description: 'Овощи на мангале, приготовленные в виде салата.', variants: [{ label: 'Цена', price: '110 ₽' }], image: '/adzap.jpg' },
    { name: 'Печень в сетке (свиная/говяжья)', description: 'Нежная печень в жировой сетке, приготовленная на мангале.', variants: [{ label: 'Цена', price: '125 ₽' }], image: '/pechen1.jpg' }
  ];

  // Убираем цену «за кусок», первой строкой — «30 см», затем «20 см»
  const prepareVariants = (items) => items.map((item) => ({
    ...item,
    variants: item.variants
      ? item.variants
          .filter((v) => v.label !== 'Кусок')
          .sort((a, b) => (parseFloat(b.label) || 0) - (parseFloat(a.label) || 0))
      : item.variants
  }));

  // Разбивка вертикального меню ровно на 5 экранов:
  // пицца — 8 наименований на экран (2 экрана), фастфуд — все 12 позиций на одном экране,
  // мангал — по 10 на экран (2 экрана). Профиль задаёт ряды на экран и компактность карточек.
  const sectionProfiles = {
    pizza: { rowsPerScreen: 4, nameBox: 22, nameSize: 18, nameMin: 10, descBox: 118, descSize: 13, descMin: 8, priceSize: 15, priceGap: 4, photo: 126, pad: 4, descGap: 0, pricesBelow: true },
    fastfood: { rowsPerScreen: 6, nameBox: 32, nameSize: 16, nameMin: 9, descBox: 58, descSize: 13, descMin: 8, priceSize: 14, priceGap: 5, photo: 74, pad: 5, descGap: 3 },
    mangal: { rowsPerScreen: 5, nameBox: 30, nameSize: 17, nameMin: 10, descBox: 56, descSize: 12, descMin: 7, priceSize: 14, priceGap: 5, photo: 100, pad: 6, descGap: 4 }
  };

  // Цены приходят с сервера и обновляются сами (каждые 5 минут).
  // СОСТАВ И ПОРЯДОК ПОЗИЦИЙ — из вшитых списков ниже (ровно 5 экранов),
  // с сервера берутся только свежие цены по названию позиции.
  const [serverPrices, setServerPrices] = useState(null);
  useEffect(() => {
    const API = 'https://api.гурман-супермаркет.рф';
    const load = () => {
      fetch(API + '/api/menu')
        .then((r) => r.json())
        .then((data) => {
          if (!data.products || !data.tv) return;
          const tv = data.tv;
          const prices = {};
          for (const p of data.products) {
            if (tv[p.name]) {
              prices[p.name] = tv[p.name].map((v) => ({ label: v.label, price: (v.price || 0) + ' ₽' }));
            } else if (p.variants) {
              prices[p.name] = p.variants.map((v) => ({ label: v.label, price: (v.price || 0) + ' ₽' }));
            }
          }
          setServerPrices(prices);
        })
        .catch(() => {});
    };
    load();
    const poll = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(poll);
  }, []);

  // применяем свежие цены к вшитым спискам (состав не меняется)
  const applyPrices = (items) => items.map((item) => {
    const fresh = serverPrices && serverPrices[item.name];
    return fresh ? { ...item, variants: fresh } : item;
  });

  const sections = [
    { title: 'ПИЦЦА', items: prepareVariants(applyPrices(pizzaItems)), profile: sectionProfiles.pizza },
    { title: 'ФАСТФУД', items: prepareVariants(applyPrices(fastfoodItems)), profile: sectionProfiles.fastfood },
    { title: 'МАНГАЛ', items: prepareVariants(applyPrices(mangalItems)), profile: sectionProfiles.mangal }
  ];

  // --- Адаптив под ориентацию экрана ---
  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Фиксированный вертикальный формат: в приложении (WebView) контент всегда повёрнут
  // на -90° под физически вертикальный ТВ (приставка отдаёт повёрнутый кадр).
  // В обычном браузере (сайт на телефонах) поворот не нужен.
  const rotation = /;\s*wv\)/.test(navigator.userAgent) ? '-90' : '0';

  useEffect(() => {
    const updateViewport = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);
    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, []);

  // В повернутом режиме WebView не прокручивает повернутый контент жестами —
  // обрабатываем свайпы вручную, пересчитывая их в ось прокрутки по углу поворота.
  const scrollRef = useRef(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || rotation === '0') return;
    const theta = (Number(rotation) * Math.PI) / 180;
    let last = null;
    const onStart = (e) => {
      const t = e.touches[0];
      last = { x: t.clientX, y: t.clientY };
    };
    const onMove = (e) => {
      if (!last) return;
      const t = e.touches[0];
      const dx = t.clientX - last.x;
      const dy = t.clientY - last.y;
      last = { x: t.clientX, y: t.clientY };
      el.scrollTop += Math.round(Math.sin(theta) * dx - Math.cos(theta) * dy);
      e.preventDefault();
    };
    const onEnd = () => { last = null; };
    el.style.touchAction = 'none';
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      el.style.touchAction = '';
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
    };
  }, [rotation]);

  const rotated = rotation !== '0';
  // Для раскладки считаем экран таким, каким его видит зритель:
  // при повороте CSS на 90° ширина и высота меняются местами
  const screenWidth = rotated ? viewport.height : viewport.width;
  const screenHeight = rotated ? viewport.width : viewport.height;

  const isPortrait = screenHeight >= screenWidth;
  // Вертикальный ТВ: 2 колонки карточек «текст слева, круглое фото справа» — как в макете.
  // Узкий телефон — 1 колонка. Горизонтальный экран — 3 колонки.
  const columns = isPortrait ? (screenWidth >= 420 ? 2 : 1) : (screenWidth >= 1100 ? 3 : 2);
  // Масштаб относительно базовой ширины вертикального ТВ 540 CSS px (1080 физических при x2)
  const scale = isPortrait
    ? Math.min(Math.max(screenWidth / 540, 0.8), 2.2)
    : Math.min(Math.max(screenWidth / 1600, 0.9), 1.5);
  const px = (value) => `${Math.round(value * scale)}px`;

  // Высота шапки раздела (полоса + заголовок + отступы) в масштабе,
  // вычитается из высоты экрана при расчёте высоты ряда карточек
  const sectionHeaderH = Math.round(100 * scale);

  // Цены в данных вида '535 ₽' — приводим к формату макета '535 руб'
  const rub = (price) => `${String(price).replace(/\s*₽\s*/, '')} руб`;

  const menu = (
    <div style={{ backgroundColor: '#ffffff', fontFamily: 'Montserrat, sans-serif', width: '100%', height: '100%', margin: 0, display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden' }}>

      {/* Прокручиваемый список секций */}
      <div ref={scrollRef} style={{ width: '100%', flex: 1, minHeight: 0, overflowY: 'auto', padding: `0 ${px(8)}`, boxSizing: 'border-box' }}>
        {sections.map((section, sIndex) => {
          // В вертикальном режиме секция делится на страницы по одному экрану,
          // у каждой страницы — свой заголовок категории
          const p = isPortrait ? section.profile : { ...sectionProfiles.pizza, rowsPerScreen: null };
          // Высота ряда: из высоты экрана вычитаем шапку раздела и промежутки между рядами
          const rowGap = Math.round(8 * scale);
          const rowH = p.rowsPerScreen
            ? Math.max(60, Math.floor((screenHeight - sectionHeaderH - (p.rowsPerScreen - 1) * rowGap) / p.rowsPerScreen))
            : null;
          const itemsPerPage = p.rowsPerScreen ? p.rowsPerScreen * columns : section.items.length;
          const pages = Math.ceil(section.items.length / itemsPerPage);

          const renderHeader = (marginTop) => (
            <React.Fragment>
              {/* Чёрная полоса + крупный заголовок раздела */}
              <div style={{ height: px(6), background: '#1a1a1a', marginTop: marginTop, marginBottom: px(10) }}></div>
              <h2 style={{ fontSize: px(48), fontWeight: 900, color: '#111827', margin: `0 0 ${px(12)} 0`, textTransform: 'uppercase', letterSpacing: px(1), lineHeight: 1 }}>
                {section.title}
              </h2>
            </React.Fragment>
          );

          const renderCard = (item, i) => {
            const cardStyle = { display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden', border: '2px solid rgba(255, 105, 0, 0.45)', borderRadius: px(14), background: 'transparent', padding: px(p.pad) };

            const nameEl = (
              <FitText text={item.name} boxHeight={p.nameBox} baseSize={p.nameSize} minSize={p.nameMin} scale={scale} lineHeight={1.1} fontWeight={900} color="#111827" uppercase style={{ marginBottom: px(3) }} />
            );

            const descEl = (
              <FitText text={item.description} boxHeight={p.descBox} baseSize={p.descSize} minSize={p.descMin} scale={scale} lineHeight={1.25} fontWeight={400} color="#374151" style={{ marginBottom: px(p.descGap) }} />
            );

            const photoEl = (
              <div style={{ width: px(p.photo), height: px(p.photo), flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={item.image} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
            );

            const pricesEl = (
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: px(4) }}>
                {item.variants && item.variants.map((v, vIdx) => (
                  <div key={vIdx} style={{ display: 'flex', alignItems: 'baseline', gap: px(p.priceGap || 5), fontSize: px(p.priceSize), lineHeight: 1.3, color: '#111827' }}>
                    {v.label !== 'Цена' && <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{v.label}</span>}
                    <span style={{ flex: 1, minWidth: px(8), overflow: 'hidden', whiteSpace: 'nowrap' }}>________________________________________________________________</span>
                    <b style={{ fontWeight: 900, whiteSpace: 'nowrap' }}>{rub(v.price)}</b>
                  </div>
                ))}
              </div>
            );

            if (p.pricesBelow) {
              // Пицца: крупное фото справа от описания, цены — внизу на всю ширину карточки
              return (
                <div key={i} style={cardStyle}>
                  {nameEl}
                  <div style={{ display: 'flex', alignItems: 'center', gap: px(6), flex: 1, minHeight: 0 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {descEl}
                    </div>
                    {photoEl}
                  </div>
                  {pricesEl}
                </div>
              );
            }

            // Остальные разделы: текст слева (описание + цены), фото справа
            return (
              <div key={i} style={cardStyle}>
                {nameEl}
                <div style={{ display: 'flex', alignItems: 'center', gap: px(6) }}>
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                    {descEl}
                    {pricesEl}
                  </div>
                  {photoEl}
                </div>
              </div>
            );
          };

          const gridStyle = (rows) => ({ display: 'grid', gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, columnGap: px(10), rowGap: px(8), gridAutoRows: rows ? `${rows}px` : 'auto' });

          if (isPortrait) {
            // Каждая страница — ровно один экран со своим заголовком категории
            return Array.from({ length: pages }).map((_, pageIdx) => (
              <div key={`${sIndex}-${pageIdx}`} style={{ minHeight: screenHeight, overflow: 'hidden' }}>
                {renderHeader(pageIdx === 0 && sIndex === 0 ? 0 : px(14))}
                <div style={gridStyle(rowH)}>
                  {section.items.slice(pageIdx * itemsPerPage, (pageIdx + 1) * itemsPerPage).map(renderCard)}
                </div>
              </div>
            ));
          }

          // Горизонтальный режим: секция целиком с обычной прокруткой
          return (
            <div key={sIndex} style={{ marginBottom: px(26) }}>
              {renderHeader(sIndex === 0 ? 0 : px(14))}
              <div style={gridStyle(null)}>
                {section.items.map(renderCard)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: '#0f172a', overflow: 'hidden' }}>
      {rotated ? (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: viewport.height, height: viewport.width,
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          boxSizing: 'border-box'
        }}>
          {menu}
        </div>
      ) : (
        <div style={{ position: 'absolute', inset: 0, boxSizing: 'border-box' }}>
          {menu}
        </div>
      )}
    </div>
  );
}