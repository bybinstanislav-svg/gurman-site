# React + Vite

## Сервер заказов

Сайт (гурман-супермаркет.рф) лежит в Яндекс Object Storage и сам принимать заказы не может — для этого нужен запущенный `server/server.js`. Как поднять его на виртуальной машине Яндекс Клауд — пошагово в [DEPLOY.md](DEPLOY.md).

## Экран кухни (заказы с сайта)

1. Соберите сайт: `npm run build`
2. Запустите сервер: `node server/server.js`
3. Откройте на планшете/ТВ в браузере: `http://<адрес-компьютера>:3000/kitchen`

Заказы, оформленные на сайте, появляются на экране кухни автоматически (обновление раз в 5 секунд), со звуком и подсветкой. Статусы: **Новые → Готовятся → Готовы → Выдан**. Заказы хранятся в `server/orders.json` и не теряются при перезапуске сервера.

**Стоп-лист** (кнопка на экране кухни): если позиции нет в наличии — поставьте её на стоп. Она сразу станет недоступной для заказа на сайте (кнопка «Нет в наличии»), закроется чёрно-белой плашкой «НЕТ В НАЛИЧИИ» на ТВ-меню (`/tv`), а заказы с ней отклоняются. Список хранится в `server/stops.json`.

## Android-приложение (для клиентов)

Приложение — это тот же сайт: меню, корзина, оформление заказа. Никакой настройки на телефоне клиента не требуется.

Чтобы заказы из приложения доходили до кухни, впишите публичный адрес сервера в начале файла `src/api.js`:

```js
const APP_SERVER_URL = 'http://адрес-вашего-сервера:3000';
```

(сервер должен быть доступен из интернета — например, на VPS-хостинге). После этого:
1. `npm run build`
2. `npx cap sync android`
3. Пересоберите APK в Android Studio (Run)

Для проверки на локальной Wi-Fi сети можно, не меняя код, выполнить на телефоне в приложении один раз:
`localStorage.setItem('gurman_api', 'http://192.168.1.50:3000')` — этот адрес имеет приоритет.

---

This template provides a minimal setup for getting React to work in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
