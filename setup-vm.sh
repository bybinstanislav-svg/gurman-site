#!/usr/bin/env bash
# Установка сервера заказов «Гурман» на виртуальную машину (Ubuntu, Яндекс Клауд).
# Запускать из домашней папки на ВМ: bash setup-vm.sh
# Можно запускать повторно — обновит сайт и перезапустит сервер.
set -e

REPO="https://github.com/bybinstanislav-svg/gurman-site.git"
SITE="https://xn----7sbbjmb8aldhxhgcjycg.xn--p1ai" # гурман-супермаркет.рф

echo "=== 1/5 Устанавливаю Node.js и утилиты (если ещё нет)..."
if ! command -v node >/dev/null 2>&1; then
  sudo apt update
  sudo apt install -y nodejs npm git wget
fi

echo "=== 2/5 Скачиваю проект с GitHub..."
if [ -d gurman ]; then
  cd gurman
  git pull --rebase || true
else
  git clone --depth 1 "$REPO" gurman
  cd gurman
fi

echo "=== 3/5 Устанавливаю зависимости сервера (без сборщиков, быстро)..."
npm install --omit=dev

echo "=== 4/5 Скачиваю сайт с основного адреса (для экрана кухни, без видео)..."
rm -rf dist
mkdir -p dist
wget -q -e robots=off -r -l 3 -np -nH -R '*.mp4' -P dist "$SITE/" || true
ls dist/index.html >/dev/null || echo "  предупреждение: index.html не скачался, экран кухни будет недоступен"

echo "=== 5/5 Запускаю сервер (pm2 — авто-перезапуск)..."
sudo npm install -g pm2 >/dev/null 2>&1
pm2 delete gurman >/dev/null 2>&1 || true
pm2 start server/server.js --name gurman
pm2 save

IP=$(curl -s ifconfig.me 2>/dev/null || echo "адрес-ВМ")
echo ""
echo "================================================"
echo "  Готово! Локальная проверка:"
curl -s -o /dev/null -w "  API заказов: http://$IP:3000/api/orders/active — HTTP %{http_code}\n" http://localhost:3000/api/orders/active || true
echo "  Экран кухни: http://$IP:3000/kitchen"
echo ""
echo "  Не забудьте: pm2 startup выше напечатал команду —"
echo "  выполните её, чтобы сервер поднимался после перезагрузки ВМ."
echo "================================================"
