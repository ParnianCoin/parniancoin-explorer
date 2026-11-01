#!/bin/bash

LOG="/var/log/parnian-explorer-reset.log"
echo "==== $(date) - شروع ریست ====" >> "$LOG"

# توقف سرویس
systemctl stop parnian-explorer.service
echo "سرویس متوقف شد" >> "$LOG"

# پاک کردن پوشه data
rm -rf /etc/parnian/Explorer.ParnianCoin/server/data
echo "پوشه data حذف شد" >> "$LOG"

# راه‌اندازی مجدد سرویس
systemctl start parnian-explorer.service
echo "سرویس دوباره راه‌اندازی شد" >> "$LOG"

echo "==== پایان ====" >> "$LOG"
