import React, { useState } from 'react';
import './TvMenu.css';

export default function TvMenu() {
  const [menuData, setMenuData] = useState(() => {
    const saved = localStorage.getItem('gurman_12_items_per_screen_v1');
    return saved ? JSON.parse(saved) : {
      screen1: [
        { name: "Шашлык из свинины антрекот", desc: "Кусочки антрекота, маринованные по фирменному рецепту на углях", price: "155 ₽", image: "mysnoy3.png" },
        { name: "Шашлык из куриного филе", desc: "Нежное куриное филе со специями на мангале", price: "155 ₽", image: "shaurma.jpg" },
        { name: "Люля-кебаб из говядины", desc: "Традиционное восточное блюдо из рубленого мяса", price: "145 ₽", image: "gril.png" },
        { name: "Шашлык из баранины", desc: "Классический кавказский шашлык из мякоти молодого барашка", price: "280 ₽", image: "mysnoy3.png" },
        { name: "Форель речная", desc: "Сочные ребрышки / рыба, запеченные на огне", price: "170 ₽", image: "shaurma.jpg" },
        { name: "Куриные крылышки на углях", desc: "Хрустящие и сочные крылышки в пикантном соусе", price: "140 ₽", image: "chicen-burger.png" },
        { name: "Шампиньоны на мангале", desc: "Крупные шляпки свежих грибов в сливочно-чесночном соусе", price: "90 ₽", image: "gril.png" },
        { name: "Стейк из семги", desc: "Сочный стейк из красной рыбы на углях с лимоном", price: "450 ₽", image: "mysnoy3.png" },
        { name: "Шашлык из индейки", desc: "Диетический и нежный шашлык из филе грудки индейки", price: "180 ₽", image: "shaurma.jpg" },
        { name: "Овощи на мангале «Хоровац»", desc: "Приготовленные в виде салата", price: "110 ₽", image: "gril.png" },
        { name: "Картофель с салом", desc: "Молодой картофель с ломтиками копченого сала на шампуре", price: "60 ₽", image: "kartofel-fri.png" },
        { name: "Люля-кебаб из курицы", desc: "Сочный кебаб из рубленого куриного филе с зеленью", price: "160 ₽", image: "chicen-burger.png" }
      ],
      screen2: [
        { name: "Свинина по-царски", desc: "Запеченная свинина под сырной корочкой с томатами", price: "195 ₽", image: "mysnoy3.png" },
        { name: "Курица запеченная", desc: "Ароматные кусочки курицы с золотистой корочкой", price: "135 ₽", image: "shaurma.jpg" },
        { name: "Котлета по-киевски", desc: "Классическая котлета с нежным сливочным маслом внутри", price: "150 ₽", image: "chicen-burger.png" },
        { name: "Рыба под маринадом", desc: "Нежное филе белой рыбы с овощной зажаркой", price: "165 ₽", image: "shaurma.jpg" },
        { name: "Ребрышки барбекю", desc: "Свиные ребрышки в фирменном соусе барбекю", price: "240 ₽", image: "gril.png" },
        { name: "Овощное рагу", desc: "Тушеные сезонные овощи со специями и зеленью", price: "85 ₽", image: "kartofel-derevna.png" },
        { name: "Картофель по-деревенски", desc: "Запеченные дольки картофеля с чесноком и травами", price: "95 ₽", image: "kartofel-derevna.png" },
        { name: "Купаты домашние", desc: "Сочные мясные колбаски пряного посола на гриле", price: "160 ₽", image: "mysnoy3.png" },
        { name: "Медальоны из индейки", desc: "Нежное филе индейки в сливочном соусе", price: "210 ₽", image: "shaurma.jpg" },
        { name: "Стейк из свиной шеи", desc: "Мягкий и сочный стейк со специями на углях", price: "260 ₽", image: "gril.png" },
        { name: "Перемчи с мясом", desc: "Традиционные румяные пирожки с сочной начинкой", price: "75 ₽", image: "chicen-burger.png" },
        { name: "Сулугуни в лаваше", desc: "Сыр сулугуни, запеченный в хрустящем лаваше с зеленью", price: "130 ₽", image: "fresh-roll.png" }
      ],
      screen3: [
        { name: "ГУРМАН", desc: "Томатный соус, ветчина, бекон, охотничьи колбаски, помидоры, моцарелла, зелень", p1: "77 ₽", p2: "325 ₽", p3: "595 ₽", image: "gurman.png" },
        { name: "Пепперони", desc: "Пикантная пепперони, увеличенная порция моцареллы, томатный соус", p1: "82 ₽", p2: "275 ₽", p3: "635 ₽", image: "pepperoni-pizza.png" },
        { name: "4 сыра", desc: "Пармезан, чедер, много моцареллы, дор блю, чесночное масло", p1: "90 ₽", p2: "315 ₽", p3: "725 ₽", image: "4sira-pizza-.png" },
        { name: "Вашенгтон", desc: "Колбаса варена копченая, помидоры, перец болгарский, майонез, моцарелла, томатный соус", p1: "75 ₽", p2: "275 ₽", p3: "595 ₽", image: "washengton.png" },
        { name: "Гавайская", desc: "Сочные ананасы, колбаса варена копченая, фирменный томатный соус, моцарелла", p1: "79 ₽", p2: "315 ₽", p3: "499 ₽", image: "gawai.png" },
        { name: "Бургур-пицца", desc: "Ветчина, томаты, маринованные огурчики, моцарелла, красный лук, соус бургер", p1: "99 ₽", p2: "275 ₽", p3: "599 ₽", image: "burger-pizza.png" },
        { name: "Диабло", desc: "Томатный соус, ветчина, пепперони, охотничьи колбаски, острый перчик, лук, моцарелла", p1: "77 ₽", p2: "275 ₽", p3: "595 ₽", image: "diablo.png" },
        { name: "Цезарь", desc: "Чесночное масло, курочка, моцарелла, помидоры, соус ранч, салат листовой", p1: "70 ₽", p2: "275 ₽", p3: "535 ₽", image: "cezar.png" },
        { name: "Жульен", desc: "Куриное филе, шампиньоны, насыщенный грибной соус, сыр моцарелла", p1: "75 ₽", p2: "365 ₽", p3: "595 ₽", image: "zulen.png" },
        { name: "Барбекю", desc: "Сочная ветчина, бекон, соус барбекю, болгарский перец, томаты, сыр моцарелла", p1: "84 ₽", p2: "275 ₽", p3: "655 ₽", image: "bbq.png" },
        { name: "Вегетарианская", desc: "Томаты, сладкий перец, шампиньоны, красный лук, томатный соус, моцарелла", p1: "65 ₽", p2: "235 ₽", p3: "525 ₽", image: "gurman.png" },
        { name: "Чиз Карбонара", desc: "Бекон, курица, томат, моцарелла, сырный соус, хрустящий лук", p1: "75 ₽", p2: "365 ₽", p3: "595 ₽", image: "chiz-carbonara.png" }
      ],
      screen4: [
        { name: "Охотничья", desc: "Томатный соус, салями, охотничьи колбаски, бекон, острый перчик, грибы, моцарелла", p1: "85 ₽", p2: "355 ₽", p3: "755 ₽", image: "ohotnichia.png" },
        { name: "Мексиканская", desc: "Томатный соус, куриный фарш, томат, лук, острый перчик, моцарелла", p1: "85 ₽", p2: "315 ₽", p3: "755 ₽", image: "ohotnichia.png" },
        { name: "Сицилийская", desc: "Острые колбаски, маслины, каперсы, моцарелла", p1: "85 ₽", p2: "315 ₽", p3: "680 ₽", image: "diablo.png" },
        { name: "Деревенская", desc: "Курица, картофель, грибы, сливочный соус", p1: "78 ₽", p2: "295 ₽", p3: "580 ₽", image: "zulen.png" },
        { name: "Морская", desc: "Креветки, кальмары, сливочный соус, лимон, сыр", p1: "95 ₽", p2: "380 ₽", p3: "790 ₽", image: "pepperoni-pizza.png" },
        { name: "Четыре сезона", desc: "Каждый сектор с уникальной начинкой от шефа", p1: "88 ₽", p2: "340 ₽", p3: "710 ₽", image: "gurman.png" },
        { name: "Грибная", desc: "Шампиньоны, белые грибы, трюфельное масло, сыр", p1: "80 ₽", p2: "310 ₽", p3: "640 ₽", image: "4sira-pizza-.png" },
        { name: "Мясной бум", desc: "Двойная порция мяса, бекон, охотничьи колбаски", p1: "92 ₽", p2: "360 ₽", p3: "750 ₽", image: "ohotnichia.png" },
        { name: "Сырная курица", desc: "Куриное филе, ананасы, двойной сыр, соус", p1: "82 ₽", p2: "295 ₽", p3: "610 ₽", image: "cezar.png" },
        { name: "Острая салями", desc: "Салями калабрийская, халапеньо, томатный соус", p1: "83 ₽", p2: "305 ₽", p3: "630 ₽", image: "diablo.png" },
        { name: "Сливочный лосось", desc: "Слабосоленый лосось, сливочный сыр, зелень", p1: "110 ₽", p2: "420 ₽", p3: "890 ₽", image: "bbq.png" },
        { name: "Детская", desc: "Курочка, моцарелла, сладкий томатный соус", p1: "72 ₽", p2: "270 ₽", p3: "540 ₽", image: "gurman.png" }
      ],
      screen5: [
        { name: "Гриль бургер с говядиной", desc: "Сочная говяжья котлета, чеддер, салат, помидоры, соус гриль", price: "199 ₽", image: "gril.png" },
        { name: "Чикенбургер", desc: "Хрустящая куриная котлета, соус ранч", price: "179 ₽", image: "chicen-burger.png" },
        { name: "Фреш ролл", desc: "Куриное филе, айсберг, томаты", price: "195 ₽", image: "fresh-roll.png" },
        { name: "Ролл мясной", desc: "С чеддером, моцареллой и пепперони", price: "249 ₽", image: "mysnoy3.png" },
        { name: "Ролл Сырный с курицей", desc: "Моцарелла, куриное филе, лук", price: "119 ₽", image: "syrniy-roll2.png" },
        { name: "Картофель фри", desc: "Цена за 100 грамм", price: "65 ₽", image: "kartofel-fri.png" },
        { name: "Картофель Айдахо", desc: "Крупные дольки со специями", price: "129 ₽", image: "kartofel-derevna.png" },
        { name: "Ролл дракон", desc: "Колбаски, халапеньо, барбекю", price: "139 ₽", image: "dracon2.png" },
        { name: "Шаурма с курицей", desc: "Куриное филе, овощи, соус в лаваше", price: "175 ₽", image: "shaurma.jpg" },
        { name: "Гиро с курицей", desc: "Сочная курица, картофель фри", price: "175 ₽", image: "fresh-roll.png" },
        { name: "Хот-дог классический", desc: "Сосиска, кетчуп, лук", price: "84 ₽", image: "chicen-burger.png" },
        { name: "Френч-дог", desc: "В закрытой французской булочке", price: "125 ₽", image: "gril.png" }
      ]
    };
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [formData, setFormData] = useState(menuData);

  const handleSave = () => {
    setMenuData(formData);
    localStorage.setItem('gurman_12_items_per_screen_v1', JSON.stringify(formData));
    setIsAdminOpen(false);
  };

  const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

  return (
    <div className="replica-wrapper">
      <button className="gurman-admin-btn" onClick={() => setIsAdminOpen(true)}>
        ⚙️ Изменить цены
      </button>

      {Object.entries({
        "МАНГАЛ И ГРИЛЬ (ЧАСТЬ 1)": menuData.screen1,
        "МАНГАЛ И ГРИЛЬ (ЧАСТЬ 2)": menuData.screen2,
        "ПИЦЦА МЕНЮ (ЧАСТЬ 1)": menuData.screen3,
        "ПИЦЦА МЕНЮ (ЧАСТЬ 2)": menuData.screen4,
        "ФАСТ ФУД И СТРИТФУД": menuData.screen5
      }).map(([title, items], sIdx) => {
        const key = `screen${sIdx + 1}`;
        const isPizza = sIdx === 2 || sIdx === 3;

        return (
          <div className="replica-poster" key={sIdx}>
            <div className="replica-header">
              <h1 className="replica-main-title">ГУРМАН МЕНЮ</h1>
              <div className="replica-legend">
                <span className="badge-spicy">🔥 {title}</span>
              </div>
            </div>

            <div className="replica-grid">
              {items.map((item, i) => (
                <div className="replica-card" key={i}>
                  <div className="replica-top">
                    <div className="replica-title-row">
                      <h3 className="replica-name">{item.name}</h3>
                      <span className="replica-letter">{letters[i % letters.length]}</span>
                    </div>
                    <p className="replica-desc">{item.desc}</p>
                  </div>

                  <div className="replica-bottom">
                    <div className="replica-img-container">
                      <img src={item.image} alt={item.name} className="replica-img" />
                    </div>
                    {isPizza ? (
                      <div className="replica-pizza-prices">
                        <span>Кусок: <b>{item.p1}</b></span>
                        <span>20см: <b>{item.p2}</b></span>
                        <span>30см: <b>{item.p3}</b></span>
                      </div>
                    ) : (
                      <div className="replica-price">{item.price}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {isAdminOpen && (
        <div className="admin-overlay" onClick={() => setIsAdminOpen(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>Редактирование цен меню</h3>
            <div className="admin-scroll">
              {Object.keys(formData).map(k => (
                <div key={k} style={{marginBottom: '15px'}}>
                  <h4 style={{color: '#FF6900', marginBottom: '5px'}}>{k.toUpperCase()}</h4>
                  {formData[k].map((it, idx) => (
                    <div key={idx} style={{display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px'}}>
                      <span style={{flex: 1, fontSize: '13px'}}>{it.name}</span>
                      {it.price ? (
                        <input 
                          type="text" 
                          value={it.price} 
                          onChange={e => {
                            const val = e.target.value;
                            setFormData(p => {
                              const u = {...p};
                              u[k][idx].price = val;
                              return u;
                            });
                          }}
                          style={{width: '90px', padding: '4px', background: '#222', color: '#fff', border: '1px solid #444'}}
                        />
                      ) : (
                        <div style={{display: 'flex', gap: '4px'}}>
                          <input type="text" value={it.p1} onChange={e=>{const v=e.target.value; setFormData(p=>{const u={...p}; u[k][idx].p1=v; return u;})}} style={{width: '60px', background: '#222', color: '#fff'}} placeholder="кусок"/>
                          <input type="text" value={it.p2} onChange={e=>{const v=e.target.value; setFormData(p=>{const u={...p}; u[k][idx].p2=v; return u;})}} style={{width: '60px', background: '#222', color: '#fff'}} placeholder="20см"/>
                          <input type="text" value={it.p3} onChange={e=>{const v=e.target.value; setFormData(p=>{const u={...p}; u[k][idx].p3=v; return u;})}} style={{width: '60px', background: '#222', color: '#fff'}} placeholder="30см"/>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px'}}>
              <button onClick={() => setIsAdminOpen(false)} style={{padding: '8px 16px', background: '#444', color: '#fff', border: 'none', borderRadius: '4px'}}>Закрыть</button>
              <button onClick={handleSave} style={{padding: '8px 16px', background: '#2ecc71', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold'}}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}