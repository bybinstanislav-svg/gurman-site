import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Volume2, VolumeX, Maximize, Minimize, Wifi, WifiOff,
  Play, Check, Undo2, Bike, Store, Ban, Search, X,
} from 'lucide-react';
import { api } from './api';
import { MENU_DATA } from './menuData';
import './KitchenPanel.css';

const COLUMNS = [
  { id: 'new', title: 'Новые', color: '#3b82f6' },
  { id: 'cooking', title: 'Готовятся', color: '#f59e0b' },
  { id: 'ready', title: 'Готовы к выдаче', color: '#22c55e' },
];

const CATEGORY_LABELS = { pizza: 'Пицца', fastfood: 'Фаст Фуд', mangal: 'Мангал' };

const WARN_AFTER_MS = 10 * 60 * 1000;   // 10 минут в очереди — жёлтый таймер
const DANGER_AFTER_MS = 20 * 60 * 1000; // 20 минут — красный мигающий

function formatElapsed(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function formatClock(date) {
  return [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((n) => String(n).padStart(2, '0'))
    .join(':');
}

function formatTime(iso) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// --- Отдельная карточка заказа ---

function OrderCard({ order, now, isRecent, onChangeStatus }) {
  const elapsed = now - new Date(order.createdAt).getTime();
  const urgency = elapsed >= DANGER_AFTER_MS ? 'danger' : elapsed >= WARN_AFTER_MS ? 'warn' : '';
  const positions = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className={`kds-card${isRecent ? ' is-recent' : ''}`}>
      <div className="kds-card-top">
        <div>
          <div className="kds-order-num">№ {order.id}</div>
          <div className="kds-order-time">Принят в {formatTime(order.createdAt)}</div>
        </div>
        <div className={`kds-timer ${urgency}`}>{formatElapsed(elapsed)}</div>
      </div>

      <div className="kds-badges">
        {order.orderType === 'delivery' ? (
          <span className="kds-badge delivery"><Bike size={13} /> Доставка</span>
        ) : (
          <span className="kds-badge pickup"><Store size={13} /> Самовывоз</span>
        )}
      </div>

      <div className="kds-customer">
        {order.customerName}
        {order.phone && (
          <>
            {' · '}
            <a href={`tel:${order.phone.replace(/[^+\d]/g, '')}`}>{order.phone}</a>
          </>
        )}
        {order.orderType === 'delivery' && order.address && (
          <div>{order.address}</div>
        )}
      </div>

      <div className="kds-items">
        {order.items.map((item, index) => (
          <div className="kds-item" key={index}>
            <div className="kds-item-qty">{item.quantity}</div>
            <div className="kds-item-info">
              <div className="kds-item-name">{item.name}</div>
              {(item.variantLabel || (item.addons && item.addons.length > 0)) && (
                <div className="kds-item-sub">
                  {item.variantLabel}
                  {item.variantLabel && item.addons?.length > 0 && ' · '}
                  {item.addons?.length > 0 && `+ ${item.addons.join(', ')}`}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {order.comment && <div className="kds-comment">💬 {order.comment}</div>}

      {order.orderType === 'delivery' && (
        <div className="kds-delivery-line">
          <span>Доставка</span>
          <b>{order.deliveryFee > 0 ? `${order.deliveryFee} ₽` : 'бесплатно'}</b>
        </div>
      )}

      <div className="kds-card-footer">
        <span>{order.items.length} поз. / {positions} шт.</span>
        <span className="kds-total">{order.total} ₽</span>
      </div>

      {order.status === 'new' && (
        <div className="kds-actions">
          <button className="kds-btn start" onClick={() => onChangeStatus(order, 'cooking')}>
            <Play size={18} /> Принять в работу
          </button>
        </div>
      )}

      {order.status === 'cooking' && (
        <div className="kds-actions">
          <button className="kds-btn ready" onClick={() => onChangeStatus(order, 'ready')}>
            <Check size={18} /> Готов
          </button>
          <button className="kds-btn ghost" onClick={() => onChangeStatus(order, 'new')} title="Вернуть в новые">
            <Undo2 size={16} />
          </button>
        </div>
      )}

      {order.status === 'ready' && (
        <div className="kds-actions">
          <button className="kds-btn done" onClick={() => onChangeStatus(order, 'completed')}>
            <Check size={18} /> Выдан
          </button>
          <button className="kds-btn ghost" onClick={() => onChangeStatus(order, 'cooking')} title="Вернуть в готовку">
            <Undo2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

// --- Панель стоп-листа: позиции, которых нет в наличии ---

function StopListModal({ stops, manual, autoClosed, onClose, onToggle, onBulk, menu }) {
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);
  const manualIds = new Set(manual.map((s) => Number(s.id)));
  const query = search.trim().toLowerCase();

  const groups = Object.entries(
    menu
      .filter((p) => !query || p.name.toLowerCase().includes(query))
      .reduce((acc, product) => {
        (acc[product.category] ||= []).push(product);
        return acc;
      }, {})
  );

  const bulk = async (category, stopped) => {
    setBusy(true);
    await onBulk(category, stopped);
    setBusy(false);
  };

  return (
    <div className="kds-stops-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="kds-stops-modal">
        <div className="kds-stops-head">
          <h2><Ban size={20} /> Стоп-лист</h2>
          <button className="kds-icon-btn" onClick={onClose} title="Закрыть">
            <X size={20} />
          </button>
        </div>

        {autoClosed && (
          <div className="kds-autoclosed-banner">
            🌙 Автостоп: всё на стопе до 10:00. Внесённые вручную стопы сохранятся на завтра
          </div>
        )}

        <div className="kds-stops-search-wrap">
          <Search size={16} />
          <input
            className="kds-stops-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск позиции..."
            autoFocus
          />
        </div>

        <div className="kds-stops-bulk">
          <button className="kds-bulk-btn stop" disabled={busy} onClick={() => bulk('all', true)}>
            Стоп всё
          </button>
          <button className="kds-bulk-btn clear" disabled={busy} onClick={() => bulk('all', false)}>
            Снять все стопы
          </button>
        </div>

        <div className="kds-stops-list">
          {groups.length === 0 && <div className="kds-empty">Ничего не найдено</div>}
          {groups.map(([category, products]) => (
            <div key={category}>
              <div className="kds-stop-group-title">
                <span>{CATEGORY_LABELS[category] || category}</span>
                <span className="kds-stop-group-actions">
                  <button className="kds-group-btn" disabled={busy} onClick={() => bulk(category, true)}>
                    Стоп
                  </button>
                  <button className="kds-group-btn" disabled={busy} onClick={() => bulk(category, false)}>
                    Снять
                  </button>
                </span>
              </div>
              {products.map((product) => {
                const stopped = manualIds.has(product.id);
                return (
                  <div key={product.id} className={`kds-stop-row${stopped ? ' is-stopped' : ''}`}>
                    <span className="kds-stop-name">{product.name}</span>
                    <button
                      className={`kds-switch${stopped ? ' is-on' : ''}`}
                      onClick={() => onToggle(product)}
                      title={stopped ? 'Вернуть в продажу' : 'Поставить на стоп'}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="kds-stops-foot">
          На стопе: <b>{stops.length}</b> из {menu.length} — эти позиции недоступны для заказа
        </div>
      </div>
    </div>
  );
}

// --- Экран кухни ---

export default function KitchenPanel() {
  const [orders, setOrders] = useState([]);
  const [connected, setConnected] = useState(true);
  const [soundOn, setSoundOn] = useState(() => localStorage.getItem('kds_sound') !== 'off');
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [recentIds, setRecentIds] = useState(() => new Set());
  const [stops, setStops] = useState([]);
  const [manualStops, setManualStops] = useState([]);
  const [autoClosed, setAutoClosed] = useState(false);
  const [stopListOpen, setStopListOpen] = useState(false);
  const [menu, setMenu] = useState(MENU_DATA);

  const knownIds = useRef(null); // null = первая загрузка ещё не прошла (для неё звук не играем)
  const audioCtx = useRef(null);

  const playAlert = () => {
    try {
      if (!audioCtx.current) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return false;
        audioCtx.current = new Ctx();
      }
      const ctx = audioCtx.current;
      if (ctx.state === 'suspended') ctx.resume();
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = i % 2 === 0 ? 880 : 660;
        const t = ctx.currentTime + i * 0.35;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.5, t + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.35);
      }
      return ctx.state === 'running';
    } catch {
      return false;
    }
  };

  const unlockAudio = async () => {
    try {
      if (!audioCtx.current) playAlert();
      await audioCtx.current?.resume();
      setAudioBlocked(false);
    } catch { /* ignore */ }
  };

  const loadOrders = useCallback(async () => {
    try {
      const data = await api.fetchActiveOrders();
      setOrders(data);
      setConnected(true);

      if (knownIds.current === null) {
        knownIds.current = new Set(data.map((o) => o.id));
        return;
      }

      const fresh = data.filter((o) => !knownIds.current.has(o.id));
      if (fresh.length > 0) {
        const ids = fresh.map((o) => o.id);
        ids.forEach((id) => knownIds.current.add(id));
        setRecentIds((prev) => {
          const next = new Set(prev);
          ids.forEach((id) => next.add(id));
          return next;
        });
        // подсветка "только что пришёл" держится ~10 секунд
        setTimeout(() => {
          setRecentIds((prev) => {
            const next = new Set(prev);
            ids.forEach((id) => next.delete(id));
            return next;
          });
        }, 10000);

        if (soundOn) {
          if (!playAlert()) setAudioBlocked(true);
        }
      }
    } catch {
      setConnected(false);
    }
  }, [soundOn]);

  const loadStops = useCallback(async () => {
    try {
      const data = await api.fetchStops();
      setStops(data.stops);
      setManualStops(data.manual);
      setAutoClosed(!!data.autoClosed);
    } catch { /* стоп-лист не критичен, при ошибке оставляем как есть */ }
  }, []);

  // Меню с сервера (для стоп-листа — чтобы новые позиции появлялись сами)
  const loadMenu = useCallback(async () => {
    try {
      const data = await api.fetchMenu();
      if (Array.isArray(data.products) && data.products.length > 0) setMenu(data.products);
    } catch { /* меню не критично, остаётся вшитая копия */ }
  }, []);

  // Опрос сервера: сразу, затем каждые 5 секунд, плюс при возврате на вкладку
  useEffect(() => {
    loadOrders();
    loadStops();
    loadMenu();
    const poll = setInterval(() => { loadOrders(); loadStops(); }, 5000);
    const onFocus = () => { loadOrders(); loadStops(); loadMenu(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      clearInterval(poll);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [loadOrders, loadStops, loadMenu]);

  // Тикер для таймеров и часов
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const newCount = orders.filter((o) => o.status === 'new').length;

  // Счётчик новых заказов в заголовке вкладки
  useEffect(() => {
    document.title = newCount > 0 ? `(${newCount}) Новые заказы — Кухня` : 'Кухня — Гурман';
    return () => { document.title = 'Гурман'; };
  }, [newCount]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    localStorage.setItem('kds_sound', next ? 'on' : 'off');
    if (next) {
      if (!playAlert()) setAudioBlocked(true);
      else setAudioBlocked(false);
    }
  };

  const changeStatus = async (order, status) => {
    const prevOrders = orders;
    // оптимистично обновляем экран, при ошибке откатываем
    if (status === 'completed') {
      setOrders((cur) => cur.filter((o) => o.id !== order.id));
    } else {
      setOrders((cur) => cur.map((o) => (o.id === order.id ? { ...o, status } : o)));
    }
    try {
      await api.updateOrderStatus(order.id, status);
      setConnected(true);
    } catch {
      setOrders(prevOrders);
      setConnected(false);
    }
  };

  const toggleStop = async (product) => {
    const isStopped = manualStops.some((s) => Number(s.id) === product.id);
    // оптимистично переключаем, при ошибке откатываемся к состоянию сервера
    setManualStops((prev) =>
      isStopped
        ? prev.filter((s) => Number(s.id) !== product.id)
        : [...prev, { id: product.id, name: product.name }]
    );
    try {
      const res = await api.setStopped(product.id, !isStopped, product.name);
      setStops(res.stops);
      setManualStops(res.manual);
      setAutoClosed(!!res.autoClosed);
    } catch {
      loadStops();
    }
  };

  // массовый стоп/снятие: по категории или всё сразу
  const bulkStop = async (category, stopped) => {
    const prevStops = stops;
    const prevManual = manualStops;
    try {
      const res = await api.stopBulk(category, stopped);
      setStops(res.stops);
      setManualStops(res.manual);
      setAutoClosed(!!res.autoClosed);
    } catch {
      setStops(prevStops);
      setManualStops(prevManual);
      loadStops();
    }
  };

  const clockDate = new Date(now);

  return (
    <div className="kds">
      <header className="kds-header">
        <div className="kds-logo">
          ГУРМАН
          <small>КУХНЯ</small>
        </div>

        <div className="kds-header-stats">
          <div className="kds-stat">
            <b style={{ color: '#60a5fa' }}>{newCount}</b>
            <span>новых</span>
          </div>
          <div className="kds-stat">
            <b style={{ color: '#fbbf24' }}>{orders.filter((o) => o.status === 'cooking').length}</b>
            <span>готовятся</span>
          </div>
          <div className="kds-stat">
            <b style={{ color: '#4ade80' }}>{orders.filter((o) => o.status === 'ready').length}</b>
            <span>готовы</span>
          </div>
        </div>

        <div className="kds-header-right">
          <div className={`kds-connection${connected ? '' : ' is-offline'}`}>
            {connected ? <Wifi size={16} /> : <WifiOff size={16} />}
            <span>{connected ? 'Онлайн' : 'Нет связи'}</span>
          </div>
          <div className="kds-clock">{formatClock(clockDate)}</div>
          <button className="kds-stops-btn" onClick={() => setStopListOpen(true)} title="Стоп-лист">
            <Ban size={18} />
            <span>Стоп-лист</span>
            {stops.length > 0 && <span className="kds-stops-count">{stops.length}</span>}
          </button>
          <button
            className={`kds-icon-btn${soundOn ? ' is-active' : ''}`}
            onClick={toggleSound}
            title={soundOn ? 'Выключить звук' : 'Включить звук'}
          >
            {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <button
            className="kds-icon-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Выйти из полноэкранного режима' : 'Полноэкранный режим'}
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </header>

      {!connected && (
        <div className="kds-offline-bar">
          ⚠ Нет связи с сервером. Экран обновится автоматически, как только связь вернётся.
        </div>
      )}

      {autoClosed && !stopListOpen && (
        <div className="kds-autoclosed-bar">
          🌙 Автостоп: приём заказов закрыт до 10:00. Нажмите «Стоп-лист», чтобы управлять вручную
        </div>
      )}

      <main className="kds-board">
        {COLUMNS.map((column) => {
          const columnOrders = orders.filter((o) => o.status === column.id);
          return (
            <section
              key={column.id}
              className="kds-column"
              style={{ '--col': column.color }}
            >
              <div className="kds-column-header">
                <span className="kds-column-title">{column.title}</span>
                <span className="kds-column-count">{columnOrders.length}</span>
              </div>
              <div className="kds-column-body">
                {columnOrders.length === 0 ? (
                  <div className="kds-empty">Пока пусто</div>
                ) : (
                  columnOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      now={now}
                      isRecent={recentIds.has(order.id)}
                      onChangeStatus={changeStatus}
                    />
                  ))
                )}
              </div>
            </section>
          );
        })}
      </main>

      {audioBlocked && soundOn && (
        <button className="kds-sound-banner" onClick={unlockAudio}>
          🔊 Нажмите один раз, чтобы включить звуковые оповещения
        </button>
      )}

      {stopListOpen && (
        <StopListModal
          stops={stops}
          manual={manualStops}
          autoClosed={autoClosed}
          onClose={() => setStopListOpen(false)}
          onToggle={toggleStop}
          onBulk={bulkStop}
          menu={menu}
        />
      )}
    </div>
  );
}
