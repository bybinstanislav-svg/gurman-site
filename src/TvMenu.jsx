import React from 'react';

export default function TvMenu() {
  const menuData = {
    screen1: [
      { name: "ГУРМАН", desc: "Томатный соус, ветчина, бекон, охотничьи колбаски, помидоры, моцарелла", p1: "77 ₽", p2: "325 ₽", p3: "595 ₽", image: "gurman.png" },
      { name: "ВАШЕНГТОН", desc: "Колбаса варена копченая, помидоры, перец болгарский, сыр", p1: "75 ₽", p2: "275 ₽", p3: "595 ₽", image: "washengton.png" },
      { name: "ЖУЛЬЕН", desc: "Курица, грибы, соус жульен, сыр", p1: "75 ₽", p2: "365 ₽", p3: "595 ₽", image: "zulen.png" },
      { name: "4 СЫРА", desc: "Моцарелла, пармезан, чедер, дорблю", p1: "90 ₽", p2: "315 ₽", p3: "725 ₽", image: "4sira-pizza-.png" },
      { name: "БУРГЕР", desc: "Ветчина, томат, огурец маринованный, лук красный, соус бургер, сыр", p1: "99 ₽", p2: "275 ₽", p3: "599 ₽", image: "burger-pizza.png" },
      { name: "БАРБЕКУ", desc: "Ветчина, томат, перец болгарский, бекон, сыр", p1: "84 ₽", p2: "275 ₽", p3: "655 ₽", image: "bbq.png" },
      { name: "ГУРМАН", desc: "Томатный соус, ветчина, бекон, охотничьи колбаски, помидоры, моцарелла", p1: "77 ₽", p2: "325 ₽", p3: "595 ₽", image: "gurman.png" },
      { name: "ВАШЕНГТОН", desc: "Колбаса варена копченая, помидоры, перец болгарский, сыр", p1: "75 ₽", p2: "275 ₽", p3: "595 ₽", image: "washengton.png" },
      { name: "ЖУЛЬЕН", desc: "Курица, грибы, соус жульен, сыр", p1: "75 ₽", p2: "365 ₽", p3: "595 ₽", image: "zulen.png" },
      { name: "ГУРМАН", desc: "Томатный соус, ветчина, бекон, охотничьи колбаски, помидоры, моцарелла", p1: "77 ₽", p2: "325 ₽", p3: "595 ₽", image: "gurman.png" },
      { name: "ВАШЕНГТОН", desc: "Колбаса варена копченая, помидоры, перец болгарский, сыр", p1: "75 ₽", p2: "275 ₽", p3: "595 ₽", image: "washengton.png" },
      { name: "ЖУЛЬЕН", desc: "Курица, грибы, соус жульен, сыр", p1: "75 ₽", p2: "365 ₽", p3: "595 ₽", image: "zulen.png" }
    ],
    screen2: [
      { name: "ГАВАЙСКАЯ", desc: "Салями, ананасы, сыр", p1: "79 ₽", p2: "315 ₽", p3: "499 ₽", image: "gawai.png" },
      { name: "ДИАБЛО", desc: "Ветчина, пепперони, лук, халопеньо, охот. колбаски, сыр", p1: "77 ₽", p2: "275 ₽", p3: "595 ₽", image: "diablo.png" },
      { name: "МЕКСИКАНСКАЯ", desc: "Куриный фарш, лук, халопеньо, томат, сыр", p1: "85 ₽", p2: "315 ₽", p3: "755 ₽", image: "ohotnichia.png" },
      { name: "ОХОТНИЧЬЯ", desc: "Салями, грибы, огурцы сол. халопеньо, охот. колбаски бекон, сыр", p1: "85 ₽", p2: "355 ₽", p3: "755 ₽", image: "ohotnichia.png" },
      { name: "ЦЕЗАРЬ", desc: "Курица, томат, салат листовой, соус ранч, сыр", p1: "70 ₽", p2: "275 ₽", p3: "535 ₽", image: "cezar.png" },
      { name: "ПЕППЕРОНИ", desc: "Пепперони, халопеньо, сыр", p1: "82 ₽", p2: "275 ₽", p3: "635 ₽", image: "pepperoni-pizza.png" },
      { name: "ГАВАЙСКАЯ", desc: "Салями, ананасы, сыр", p1: "79 ₽", p2: "315 ₽", p3: "499 ₽", image: "gawai.png" },
      { name: "ДИАБЛО", desc: "Ветчина, пепперони, лук, халопеньо, охот. колбаски, сыр", p1: "77 ₽", p2: "275 ₽", p3: "595 ₽", image: "diablo.png" },
      { name: "МЕКСИКАНСКАЯ", desc: "Куриный фарш, лук, халопеньо, томат, сыр", p1: "85 ₽", p2: "315 ₽", p3: "755 ₽", image: "ohotnichia.png" },
      { name: "ОХОТНИЧЬЯ", desc: "Салями, грибы, огурцы сол. халопеньо, охот. колбаски бекон, сыр", p1: "85 ₽", p2: "355 ₽", p3: "755 ₽", image: "ohotnichia.png" },
      { name: "ЦЕЗАРЬ", desc: "Курица, томат, салат листовой, соус ранч, сыр", p1: "70 ₽", p2: "275 ₽", p3: "535 ₽", image: "cezar.png" },
      { name: "ПЕППЕРОНИ", desc: "Пепперони, халопеньо, сыр", p1: "82 ₽", p2: "275 ₽", p3: "635 ₽", image: "pepperoni-pizza.png" }
    ]
  };

  return (
    /* Уменьшили расстояние между экранами с gap: 60px до gap: 20px */
    <div style={{ backgroundColor: '#cbd5e1', fontFamily: 'Montserrat, sans-serif', padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      {Object.entries({
        "ПИЦЦА (ЭКРАН 1)": menuData.screen1,
        "ПИЦЦА (ЭКРАН 2)": menuData.screen2
      }).map(([title, items], sIdx) => (
        <div key={sIdx} style={{ width: '720px', height: '1280px', background: '#ffffff', borderRadius: '12px', border: '1px solid #94a3b8', padding: '30px 25px', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px rgba(0,0,0,0.15)', boxSizing: 'border-box' }}>
          <div style={{ borderBottom: '4px solid #0f172a', paddingBottom: '10px', marginBottom: '20px', flexShrink: 0 }}>
            <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '3px', textTransform: 'uppercase' }}>ПИЦЦА</h1>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '15px', flexGrow: 1 }}>
            {items.map((item, i) => (
              <div key={i} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '14px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '240px', boxShadow: '0 6px 15px rgba(0,0,0,0.03)' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0', textTransform: 'uppercase' }}>{item.name}</h3>
                  <p style={{ fontSize: '10px', color: '#475569', margin: 0, lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.desc}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', fontSize: '11px', color: '#334155', gap: '2px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    <div>Кусок <b style={{ color: '#059669', fontSize: '11.5px' }}>{item.p1}</b></div>
                    <div>20 см <b style={{ color: '#059669', fontSize: '11.5px' }}>{item.p2}</b></div>
                    <div>30 см <b style={{ color: '#059669', fontSize: '11.5px' }}>{item.p3}</b></div>
                  </div>

                  <div style={{ width: '75px', height: '75px', minWidth: '75px', borderRadius: '10px', overflow: 'hidden', background: '#ffffff', border: '1px solid #cbd5e1', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}