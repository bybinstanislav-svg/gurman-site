import React from 'react';

export default function TvMenu() {
  const queryParams = new URLSearchParams(window.location.search);
  const TV_SCREEN_NUMBER = parseInt(queryParams.get('screen')) || 1;

  // 1. СПИСКИ КАТЕГОРИЙ
  const pizzaItems = [
    { name: 'ГУРМАН', description: 'Томатный соус, ветчина, бекон, охотничьи колбаски, помидоры, моцарелла, зелень', variants: [{ label: 'Кусок', price: '77 ₽' }, { label: '20 см', price: '325 ₽' }, { label: '30 см', price: '595 ₽' }], image: 'gurman.png', category: 'пицца' },
    { name: 'Пепперони', description: 'Пикантная пепперони, увеличенная порция моцареллы, томатный соус', variants: [{ label: 'Кусок', price: '82 ₽' }, { label: '20 см', price: '275 ₽' }, { label: '30 см', price: '635 ₽' }], image: 'pepperoni-pizza.png', category: 'пицца' },
    { name: '4 сыра', description: 'Пармезан, чедер, много моцареллы, дор блю, чесночное масло', variants: [{ label: 'Кусок', price: '90 ₽' }, { label: '20 см', price: '315 ₽' }, { label: '30 см', price: '725 ₽' }], image: '4sira-pizza-.png', category: 'пицца' },
    { name: 'Вашингтон', description: 'Колбаса варена копченая, помидоры, перец болгарский, майонез, моцарелла, фирменный томатный соус', variants: [{ label: 'Кусок', price: '75 ₽' }, { label: '20 см', price: '275 ₽' }, { label: '30 см', price: '595 ₽' }], image: 'washengton.png', category: 'пицца' },
    { name: 'Гавайская', description: 'Сочные ананасы, колбаса варена копченая, фирменный томатный соус, моцареллы', variants: [{ label: 'Кусок', price: '79 ₽' }, { label: '20 см', price: '315 ₽' }, { label: '30 см', price: '499 ₽' }], image: 'gawai.png', category: 'пицца' },
    { name: 'Бургер-пицца', description: 'Ветчина, томаты, маринованные огурчики, моцарелла, красный лук, соус бургер, фирменный томатный соус', variants: [{ label: 'Кусок', price: '99 ₽' }, { label: '20 см', price: '275 ₽' }, { label: '30 см', price: '599 ₽' }], image: 'burger-pizza.png', category: 'пицца' },
    { name: 'Диабло', description: 'Томатный соус, ветчина, пепперони, охотничьи колбаски, острый перчик, лук, моцарелла', variants: [{ label: 'Кусок', price: '77 ₽' }, { label: '20 см', price: '275 ₽' }, { label: '30 см', price: '595 ₽' }], image: 'diablo.png', category: 'пицца' },
    { name: 'Цезарь', description: 'Чесночное масло, курочка, моцарелла, помидоры, соус ранч, салат листовой', variants: [{ label: 'Кусок', price: '70 ₽' }, { label: '20 см', price: '275 ₽' }, { label: '30 см', price: '535 ₽' }], image: 'cezar.png', category: 'пицца' },
    { name: 'Жульен', description: 'Куриное филе, шампиньоны, насыщенный грибной соус, сыр моцарелла', variants: [{ label: 'Кусок', price: '75 ₽' }, { label: '20 см', price: '365 ₽' }, { label: '30 см', price: '595 ₽' }], image: 'zulen.png', category: 'пицца' },
    { name: 'Барбекю', description: 'Сочная ветчина, бекон, соус барбекю, болгарский перец, томаты, сыр моцарелла', variants: [{ label: 'Кусок', price: '84 ₽' }, { label: '20 см', price: '275 ₽' }, { label: '30 см', price: '655 ₽' }], image: 'bbq.png', category: 'пицца' },
    { name: 'Вегетарианская', description: 'Томаты, сладкий перец, шампиньоны, красный лук, фирменный томатный соус, моцарелла', variants: [{ label: '20 см', price: '235 ₽' }, { label: '30 см', price: '525 ₽' }], image: 'veget1.png', category: 'пицца' },
    { name: 'Пицца с семгой', description: 'Семга, фирминый соус, моцарелла, томат, маслины, рукола, перец болгарский', variants: [{ label: '30 см', price: '795 ₽' }], image: 's-semgoi.png', category: 'пицца' },
    { name: 'Чиз карбонара', description: 'Бекон, курица, томат, моцарелла, сырный соус, хрустящий лук', variants: [{ label: '20 см', price: '365 ₽' }, { label: '30 см', price: '595 ₽' }], image: 'chiz-carbonara.png', category: 'пицца' },
    { name: 'Охотничья', description: 'Томатный соус, салями, охотничьи колбаски, бекон, острый перчик, маринованные огурчики, грибы, моцарелла', variants: [{ label: '20 см', price: '355 ₽' }, { label: '30 см', price: '755 ₽' }], image: 'ohotnichia.png', category: 'пицца' },
    { name: 'Мексиканская', description: 'Томатный соус, куриный фарш, томат, лук, острый перчик, моцарелла', variants: [{ label: '20 см', price: '315 ₽' }, { label: '30 см', price: '675 ₽' }], image: 'mexika.png', category: 'пицца' },
    { name: 'Пицца с морепродуктами', description: 'Томатный соус, тигровые креветки, перец болгарский, моцарелла', variants: [{ label: '30 см', price: '695 ₽' }], image: 'more1.png', category: 'пицца' }
  ];

  const fastfoodItems = [
    { name: 'Гриль бургер с говядиной', description: 'Сочная говяжья котлета, 2 ломтика чеддера, салат айсберг, помидоры, соленые огурчики, лук, фирменный соус гриль', variants: [{ label: 'Цена', price: '299 ₽' }], image: 'gril.png', category: 'фастфуд' },
    { name: 'Чикенбургер с куриной котлетой', description: 'Хрустящая куриная котлета, салат, помидоры, огурец соленый, соус ранч, сырный соус', variants: [{ label: 'Цена', price: '215 ₽' }], image: 'chicen-burger.png', category: 'фастфуд' },
    { name: 'Фреш ролл', description: 'Пшеничная лепешка, куриное филе, салат айсберг, томаты, огурец свежий, соус ранч', variants: [{ label: 'Цена', price: '195 ₽' }], image: 'roll12.png', category: 'фастфуд' },
    { name: 'Бурито', description: 'Куриный фарш со специями, огурец, кетчуп, соус ранч, мексиканская лепешка, томат.', variants: [{ label: 'Цена', price: '165 ₽' }], image: 'burito.jpg', category: 'фастфуд' },
    { name: 'Ролл мясной', description: 'СуПеР МяСнОй ролл в пшеничной лепёшке с сырам чеддер и нежной моцареллой, томатами, пепперони и куриным фаршем под знакомым соусом гриль с дымком!', variants: [{ label: 'Цена', price: '165 ₽' }], image: 'mysnoy3.png', category: 'фастфуд' },
    { name: 'Ролл Сырный с курицой', description: 'Лепешка пшеничная, моцарелла, филе куриное, жареный лучок, помидоры, сырный соус', variants: [{ label: 'Цена', price: '165 ₽' }], image: 'syrniy-roll2.png', category: 'фастфуд' },
    { name: 'Бургер Нью Йорк', description: 'Черная булочка, говяжья котлета, сыр чедер, бекон, лук, огурец соленый, соус сырный, фирменый острый соус', variants: [{ label: 'Цена', price: '275 ₽' }], image: 'negr.png', category: 'фастфуд' },
    { name: 'Картофель фри', description: 'ЦЕНА ЗА 100 грамм! Золотистая, хрустящая снаружи и мягкая внутри картошка фри с солью.', variants: [{ label: '100 г', price: '65 ₽' }], image: 'kartofel-fri.png', category: 'фастфуд' },
    { name: 'Картофель Айдахо', description: 'ЦЕНА ЗА 100 грамм! Крупные дольки картофеля со специями, обжаренные до румяной корочки.', variants: [{ label: '100 г', price: '33 ₽' }], image: 'kartofel-derevna.png', category: 'фастфуд' },
    { name: 'Ролл дракон', description: 'Сыр, охотничьи колбаски, маринованные огурчики и перчик халапеньо с барбекю соусом в зажаристой пшеничной лепешке.', variants: [{ label: 'Цена', price: '165 ₽' }], image: 'dracon2.png', category: 'фастфуд' },
    { name: 'Шаурма с курицей', description: 'Обжаренное куриное филе, свежие овощи, фирменный чесночный соус, завернутые в тонкий лаваш.', variants: [{ label: 'Цена', price: '175 ₽' }], image: 'shaurma1.png', category: 'фастфуд' },
    { name: 'Гиро с курицой', description: 'Сочная курица, картофель фри, капуста, томаты, огурцы, пикантный соус.', variants: [{ label: 'Цена', price: '175 ₽' }], image: 'giro1.png', category: 'фастфуд' },
    { name: 'Френч-дог с курино-говяжей сосиской', description: 'Обжаренная сосиска в закрытой французской булочке с соусом.', variants: [{ label: 'Цена', price: '125 ₽' }], image: 'dog.jpg', category: 'фастфуд' },
    { name: 'Сэндвич с ветчиной', description: 'Поджаренный тостовый хлеб, ветчина, сыр, листья салата, помидоры, майонез.', variants: [{ label: 'Цена', price: '165 ₽' }], image: 'send-vetshina.jpg', category: 'фастфуд' },
    { name: 'Сэндвич с курицей', description: 'Нежное куриное филе, сыр, свежие овощи и легкий соус в хрустящем хлебе.', variants: [{ label: 'Цена', price: '115 ₽' }], image: 'send-kuriza.jpg', category: 'фастфуд' },
    { name: 'Острые крылышки Баффало (5 шт)', description: 'Куриные крылышки в пикантной острой панировке. Осторожно, очень остро!', variants: [{ label: 'Цена', price: '199 ₽' }], image: 'baffalo.png', category: 'фастфуд' },
    { name: 'Боксмастер', description: 'Мексиканская лепешка с начинкой из куриных стрипсов, картофельной котлете, овощей, сырный соус и соус ранч, обжаренная в печи.', variants: [{ label: 'Цена', price: '255 ₽' }], image: 'boxmaster.png', category: 'фастфуд' }
  ];

  const mangalItems = [
    { name: 'Шашлык из свинины (антрекот)', description: 'Кусочки антрекота, маринованные по фирменному рецепту и обжаренные на углях. Подается с луком.', variants: [{ label: 'Цена', price: '155 ₽' }], image: 'antrikot.jpg', category: 'мангал' },
    { name: 'Шашлык из свинины (шея)', description: 'Сочный и мягкий шашлык из свиной шейки со специями.', variants: [{ label: 'Цена', price: '169 ₽' }], image: 'shey1.jpg', category: 'мангал' },
    { name: 'Сувлаки свиные', description: 'Мякоть свинины жареная на мангале.', variants: [{ label: 'Цена', price: '169 ₽' }], image: 'suwlak-svinina.jpg', category: 'мангал' },
    { name: 'Шашлык из куриного филе', description: 'Нежное куриное филе со специями, приготовленное на мангале. Диетический и очень вкусный выбор.', variants: [{ label: 'Цена', price: '155 ₽' }], image: 'suvlak-curiza.jpg', category: 'мангал' },
    { name: 'Шашлык из куриного бедра', description: 'Сочное куриное бедро на косточке, зажаренное на углях.', variants: [{ label: 'Цена', price: '115 ₽' }], image: 'bedro.jpg', category: 'мангал' },
    { name: 'Куриные крылья на углях', description: 'Сочные куриные крылышки, замаринованные в пикантном соусе и обжаренные до золотистой корочки.', variants: [{ label: 'Цена', price: '135 ₽' }], image: 'crilo1.jpg', category: 'мангал' },
    { name: 'Голень куриная', description: 'Куриная голень в пряном маринаде на мангале.', variants: [{ label: 'Цена', price: '115 ₽' }], image: 'golen.jpg', category: 'мангал' },
    { name: 'Шашлык из баранины', description: 'Классический кавказский шашлык из отборной мякоти молодого барашка со специями.', variants: [{ label: 'Цена', price: '175 ₽' }], image: 'baranina-makot.jpg', category: 'мангал' },
    { name: 'Шашлык из баранины пистолетики', description: 'Изысканные бараньи каре на углях.', variants: [{ label: 'Цена', price: '215 ₽' }], image: 'baranina-pistol.jpg', category: 'мангал' },
    { name: 'Люля говяжьи', description: 'Традиционное восточное блюдо из рубленого мяса с пряными специями, зажаренное до золотистой корочки.', variants: [{ label: 'Цена', price: '145 ₽' }], image: 'lula-swininagov.jpg', category: 'мангал' },
    { name: 'Люля куриные', description: 'Сочный и мягкий люля из рубленого куриного филе с добавлением сливочного масла и зелени.', variants: [{ label: 'Цена', price: '125 ₽' }], image: 'lula-curiza.jpg', category: 'мангал' },
    { name: 'Люля свино-говяжий', description: 'Ароматный рубленый люля из свинины и говядины.', variants: [{ label: 'Цена', price: '125 ₽' }], image: 'lula-swininagov.jpg', category: 'мангал' },
    { name: 'Люля свиные', description: 'Нежный рубленый люля из сочной свинины.', variants: [{ label: 'Цена', price: '110 ₽' }], image: 'lula-swininagov.jpg', category: 'мангал' },
    { name: 'Форель речная', description: 'Сочная речная форель, запеченная на углях. Подается с долькой лимона.', variants: [{ label: 'Цена', price: '170 ₽' }], image: 'forel1.jpg', category: 'мангал' },
    { name: 'Стейк из семги (Лосось стейк)', description: 'Сочный стейк из красной рыбы, обжаренный на углях. Подается с долькой лимона.', variants: [{ label: 'Цена', price: '299 ₽' }], image: 'losos.jpg', category: 'мангал' },
    { name: 'Купаты', description: 'Сочные домашние купаты с пряными травами и специями.', variants: [{ label: 'Цена', price: '125 ₽' }], image: 'cupati.jpg', category: 'мангал' },
    { name: 'Шампиньоны на мангале (Грибы)', description: 'Крупные шляпки свежих шампиньонов, запеченные с дымком.', variants: [{ label: 'Цена', price: '120 ₽' }], image: 'gribi.jpg', category: 'мангал' },
    { name: 'Аджапсандал (Хоровац)', description: 'Овощи на мангале, приготовленные в виде салата.', variants: [{ label: 'Цена', price: '110 ₽' }], image: 'adzap.jpg', category: 'мангал' },
    { name: 'Печень в сетке (свиная/говяжья)', description: 'Нежная печень в жировой сетке, приготовленная на мангале.', variants: [{ label: 'Цена', price: '125 ₽' }], image: 'pechen1.jpg', category: 'мангал' }
  ];

  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const pizzaChunks = chunkArray(pizzaItems, 12);       // [0]: 12 шт, [1]: 4 шт
  const fastfoodChunks = chunkArray(fastfoodItems, 12);   // [0]: 12 шт, [1]: 5 шт
  const mangalChunks = chunkArray(mangalItems, 12);       // [0]: 12 шт, [1]: 7 шт

  // Формируем ровно 5 экранов под 5 телевизоров:
  // Экран 1: Первые 12 пицц
  // Экран 2: Оставшиеся 4 пиццы + первые 8 позиций фастфуда (всего 12) с разделителем посредине!
  // Экран 3: Оставшиеся 9 позиций фастфуда
  // Экран 4: Первая часть мангала (12 шт)
  // Экран 5: Вторая часть мангала (остаток 7 шт)
  
  const screen2Items = [...pizzaChunks[1], ...fastfoodChunks[0].slice(0, 8)]; // 4 пиццы + 8 фастфуда = 12
  const screen3Items = fastfoodChunks[0].slice(8).concat(fastfoodChunks[1]);  // остальные 9 фастфудов

  const screens = [
    { title: 'ПИЦЦА (1)', items: pizzaChunks[0], hasSplit: false },
    { title: 'ПИЦЦА / ФАСТ ФУД', items: screen2Items, hasSplit: true, splitIndex: 4 }, // Разделитель после 4-й карточки (где кончается пицца)
    { title: 'ФАСТ ФУД', items: screen3Items, hasSplit: false },
    { title: 'МАНГАЛ (1)', items: mangalChunks[0], hasSplit: false },
    { title: 'МАНГАЛ (2)', items: mangalChunks[1], hasSplit: false }
  ];

  const currentScreenIndex = Math.min(Math.max(TV_SCREEN_NUMBER - 1, 0), screens.length - 1);
  const currentScreen = screens[currentScreenIndex];

  return (
    <div style={{ backgroundColor: '#cbd5e1', fontFamily: 'Montserrat, sans-serif', padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      
      {/* Экран телевизора */}
      <div style={{ width: '720px', height: '1280px', minHeight: '1280px', maxHeight: '1280px', background: '#ffffff', borderRadius: '12px', border: '1px solid #94a3b8', padding: '30px 25px', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px rgba(0,0,0,0.15)', boxSizing: 'border-box', overflow: 'hidden' }}>
        
        {/* Заголовок */}
        <div style={{ borderBottom: '4px solid #0f172a', paddingBottom: '10px', marginBottom: '15px', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '2px', textTransform: 'uppercase' }}>
            {currentScreen.title}
          </h1>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#64748b' }}>
            Телевизор {TV_SCREEN_NUMBER} из 5
          </span>
        </div>

        {/* Сетка блюд (3 колонки х 4 строки = 12 штук) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', gap: '10px', flexGrow: 1 }}>
          {currentScreen.items.map((item, i) => {
            // Проверяем, нужно ли перед этой карточкой вставить подзаголовок-разделитель категории
            const showSubHeader = currentScreen.hasSplit && i === currentScreen.splitIndex;

            return (
              <React.Fragment key={i}>
                {showSubHeader && (
                  <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', margin: '5px 0' }}>
                    <div style={{ flexGrow: 1, height: '2px', backgroundColor: '#0f172a' }}></div>
                    <span style={{ padding: '0 10px', fontSize: '16px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '2px' }}>Фаст Фуд</span>
                    <div style={{ flexGrow: 1, height: '2px', backgroundColor: '#0f172a' }}></div>
                  </div>
                )}

                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '10px 12px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                  
                  <div style={{ width: '100%', height: '115px', maxHeight: '115px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px', flexShrink: 0 }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>

                  <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 900, color: '#0f172a', margin: '0 0 2px 0', textTransform: 'uppercase', textAlign: 'center' }}>{item.name}</h3>
                    <p style={{ fontSize: '8.5px', color: '#475569', margin: 0, lineHeight: '1.2', textAlign: 'center', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', fontSize: '9.5px', color: '#334155', fontWeight: 600, borderTop: '1px dashed #cbd5e1', paddingTop: '6px', marginTop: '4px' }}>
                    {item.variants && item.variants.map((v, vIdx) => (
                      <div key={vIdx}>{v.label !== 'Цена' ? `${v.label}: ` : ''}<b style={{ color: '#059669', fontSize: '10px' }}>{v.price}</b></div>
                    ))}
                  </div>

                </div>
              </React.Fragment>
            );
          })}
        </div>

      </div>
    </div>
  );
}