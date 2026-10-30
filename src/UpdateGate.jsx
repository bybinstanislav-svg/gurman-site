// Проверка версии: если приложение старее минимально допустимой —
// показываем неотключаемый экран с кнопкой обновления через RuStore.
// Работает только внутри Android-приложения; на сайте пропускаем всегда.
import React, { useState } from 'react';

const isNative = () =>
  !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());

const getAppVersionCode = async () => {
  if (!isNative()) return Infinity;
  try {
    const info = await window.Capacitor.Plugins.App.getInfo();
    return info.versionCode;
  } catch {
    return Infinity;
  }
};

const openRuStore = (url) => {
  try {
    window.Capacitor.Plugins.App.launchUrl({ url });
  } catch {
    window.open(url, '_blank');
  }
};

export default function UpdateGate({ children, api }) {
  const [update, setUpdate] = useState(null); // null = проверка ещё шла или не требуется

  React.useEffect(() => {
    if (!isNative()) return;
    let cancelled = false;
    (async () => {
      try {
        // короткий таймаут: если сервер недоступен — пускаем в приложение
        const data = await Promise.race([
          api.fetchAppVersion(),
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 4000)),
        ]);
        const myCode = await getAppVersionCode();
        if (!cancelled && data.minVersionCode > myCode) {
          setUpdate(data);
        } else if (!cancelled) {
          setUpdate(false);
        }
      } catch {
        if (!cancelled) setUpdate(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (update) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
          <div className="bg-[#FF6900] text-white inline-block px-4 py-2 rounded-lg font-bold text-xl tracking-wider mb-6">
            ГУРМАН
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800 mb-3">Вышла новая версия</h1>
          <p className="text-gray-500 mb-8">
            {update.note || 'Обновите приложение, чтобы продолжить — в новой версии исправления и новые функции.'}
          </p>
          <button
            onClick={() => openRuStore(update.updateUrl)}
            className="w-full bg-[#FF6900] hover:bg-[#E05B00] transition-colors text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-500/30"
          >
            Обновить приложение
          </button>
          <p className="text-xs text-gray-400 mt-4">Откроется страница приложения в RuStore</p>
        </div>
      </div>
    );
  }

  // проверка идёт или обновление не требуется — показываем приложение
  return update === null && isNative()
    ? (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="bg-[#FF6900] text-white px-4 py-2 rounded-lg font-bold text-xl tracking-wider">ГУРМАН</div>
      </div>
    )
    : children;
}
