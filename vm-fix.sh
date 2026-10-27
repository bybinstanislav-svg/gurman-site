#!/usr/bin/env bash
# Починка доступа и запуск сервера на ВМ. Лог: /root/gurman-fix.log + serial
exec >/root/gurman-fix.log 2>&1
set -x

echo GURMAN_FIX_START > /dev/ttyS0

# 1. SSH-ключ для пользователя gurman и root
PUB='ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCu2I9Eq5Zj0wUSsGJVlazYid+61s/1S6fvasXaiIzDVfjQt1Zmv9BZnuAPz0IhrVLV9rPFub2+vi1LSEMK6KRRFlGv9vcrDbkKqmDHCZm9lu+myjPr7xStP1smKgXPZsZwFoPKxKNaR7nSpEDBVhyt/KjxreGG/bWSmVSX/5MS70XGMetk1OPrUAcRQI5BbqpPM6Vi+W3mGoQfL6OG9xwWsI4Vc9MKrs8ASWI22M1JJWPiQ4YFUiErfNSbG5vU7rhj/0pLIQCT9IwSCOPajYbr2xub5vpxIIocQle+r5ebpfCLzIshPPU3nVT8s0/iL+zzCbUO17YPZLstst6js9sh'
for U in gurman root; do
  H=$(getent passwd "$U" | cut -d: -f6)
  mkdir -p "$H/.ssh"
  grep -qF 'js9sh' "$H/.ssh/authorized_keys" 2>/dev/null || echo "$PUB" >> "$H/.ssh/authorized_keys"
  chown -R "$U:$U" "$H/.ssh"
  chmod 700 "$H/.ssh"; chmod 600 "$H/.ssh/authorized_keys"
done

# 2. Парольный вход по SSH
# пароль задается через метаданные ВМ (в репозитории не хранится)
sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config || true
systemctl restart ssh 2>/dev/null || systemctl restart sshd 2>/dev/null || true

# 3. Файрвол выключить
nft flush ruleset 2>/dev/null || true
iptables -P INPUT ACCEPT 2>/dev/null; iptables -P FORWARD ACCEPT 2>/dev/null; iptables -F 2>/dev/null || true
ufw disable 2>/dev/null || true

# 4. Сервер заказов: установить при необходимости и запустить
cd /root
if [ ! -d gurman/.git ]; then
  git clone --depth 1 https://github.com/bybinstanislav-svg/gurman-site.git gurman
fi
cd /root/gurman
git pull --rebase 2>/dev/null || true
[ -d node_modules ] || npm install --omit=dev
npm install -g pm2
pm2 delete gurman 2>/dev/null || true
pm2 start server/server.js --name gurman
pm2 save
pm2 startup systemd -u root --hp /root 2>/dev/null || true

# 5. Сайт для экрана кухни (без видео)
if [ ! -f dist/index.html ]; then
  rm -rf dist; mkdir -p dist
  wget -q -e robots=off -r -l 3 -np -nH -R '*.mp4' -P dist https://xn----7sbbjmb8aldhxhgcjycg.xn--p1ai/ || true
fi

curl -s -o /dev/null -w "LOCAL_CHECK_%{http_code}" http://127.0.0.1:3000/api/orders/active > /dev/ttyS0 2>&1 || echo "LOCAL_CHECK_FAIL" > /dev/ttyS0
echo GURMAN_FIX_DONE > /dev/ttyS0
