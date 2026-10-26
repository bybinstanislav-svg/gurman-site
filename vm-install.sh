#!/usr/bin/env bash
# Автоматическая установка сервера «Гурман» на ВМ.
# Запускается через cloud-init (bootcmd в user-data) от root, лог: /root/gurman-install.log
exec >/root/gurman-install.log 2>&1
set -x

# ждём сеть (до 2,5 минут)
for i in $(seq 1 30); do ping -c1 -W2 ya.ru >/dev/null 2>&1 && break; sleep 5; done

export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y nodejs npm git wget

# проект
cd /root
if [ -d gurman ]; then
  cd gurman
  git pull --rebase || true
else
  git clone --depth 1 https://github.com/bybinstanislav-svg/gurman-site.git gurman
  cd gurman
fi

npm install --omit=dev

# сайт для экрана кухни скачиваем с основного адреса (без видео)
rm -rf dist
mkdir -p dist
wget -q -e robots=off -r -l 3 -np -nH -R '*.mp4' -P dist https://xn----7sbbjmb8aldhxhgcjycg.xn--p1ai/ || true

# сервер с авто-перезапуском
npm install -g pm2
pm2 delete gurman >/dev/null 2>&1 || true
pm2 start server/server.js --name gurman
pm2 save
pm2 startup systemd -u root --hp /root

touch /root/.gurman-installed
echo INSTALL_DONE
