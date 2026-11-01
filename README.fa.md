<div dir="rtl">

# بلاک‌اکسپلورر پرنیان‌کوین

اکسپلورر بلاک **پرنیان‌کوین (PARC)** — فرانت‌اند Vue 2 به‌همراه یک بک‌اند کوچک Node با ایندکس SQLite داخلی.
نمونهٔ فعال: https://explorer.parniancoin.com — وب‌سایت: https://parniancoin.com

[English](README.md)

## پیش‌نیازها

- Node.js **نسخهٔ 22.13 یا بالاتر** (از `node:sqlite` داخلی استفاده می‌کند و ماژول native ندارد)
- نود سینک‌شدهٔ پرنیان‌کوین با JSON-RPC فعال (پیش‌فرض `127.0.0.1:38003`)
- فایل SCSS قالب **Material Kit** برای build فرانت‌اند (بخش «قالب» را ببینید)

## راه‌اندازی سریع

</div>

```bash
git clone https://github.com/parniancoin/parniancoin-explorer.git
cd parniancoin-explorer
npm install
# اول فایل src/assets/material-kit.scss را قرار دهید — بخش «قالب»
npm run build
PARNIAN_RPC=http://127.0.0.1:38003 node server/index.js
# مرورگر: http://127.0.0.1:38101
```

<div dir="rtl">

بک‌اند پوشهٔ `dist/` را سرو می‌کند، فقط متدهای فقط‌خواندنی JSON-RPC را به نود می‌فرستد و هر ۶۰ ثانیه بلاک‌های جدید را ایندکس می‌کند.

برای توسعه با hot reload: `npm run serve` (پورت 38100). برای اجرای همزمان هر دو: `npm start`.

## قالب

نسخهٔ اصلی با قالب تجاری *Material Kit Pro* شرکت Creative Tim ساخته شده که **قابل انتشار نیست و در این repo نیامده است**. فایل `src/App.vue` فایل `src/assets/material-kit.scss` را import می‌کند؛ قبل از build یکی از این دو را آنجا بگذارید:

- نسخهٔ Material Kit Pro که لایسنسش را خریده‌اید
- نسخهٔ رایگان [Material Kit](https://github.com/creativetimofficial/material-kit) با لایسنس MIT (فایل اصلی را `material-kit.scss` نام‌گذاری کنید). با نسخهٔ رایگان ممکن است ظاهر چند بخش کمی متفاوت باشد.

## متغیرهای محیطی

| متغیر | پیش‌فرض | کاربرد |
|-------|---------|--------|
| `PARNIAN_RPC` | `http://127.0.0.1:38003` | آدرس JSON-RPC نود |
| `PORT` | `38101` | پورت اکسپلورر |
| `PARNIAN_DB` | `server/data/explorer.sqlite` | مسیر دیتابیس |
| `PARNIAN_AUTOINDEX` | `60` | فاصلهٔ ایندکس خودکار (ثانیه)، `0` برای توقف |

## دستورهای ایندکس

</div>

```bash
npm run index                      # ایندکس افزایشی
node server/indexer.js --reset     # ساخت دوباره از بلاک صفر
node server/indexer.js --from=N    # ایندکس دوباره از ارتفاع N
```

<div dir="rtl">

## استقرار روی سرور

برای محیط عملیاتی بک‌اند (`server/index.js` روی پورت 38101) را پشت nginx بگذارید، نه سرور توسعه (`npm run serve`). نمونهٔ فایل systemd و تنظیم nginx در [README.md](README.md#production-deployment) آمده است.

## نویسنده

**امیررضا زمانی** — https://parniancoin.com — info@parniancoin.com

## لایسنس

حق نشر © ۲۰۲۶ امیررضا زمانی. منتشرشده تحت [GNU GPL v3](LICENSE).
فهرست پروژه‌هایی که این اکسپلورر بر پایهٔ آن‌ها ساخته شده در بخش Credits فایل [README.md](README.md#credits) آمده است.

</div>
