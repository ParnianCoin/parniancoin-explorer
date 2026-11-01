# ParnianCoin Block Explorer

Block explorer for **ParnianCoin (PARC)** — Vue 2 frontend plus a small Node
backend with a built-in SQLite index.
Live instance: https://explorer.parniancoin.com — Website: https://parniancoin.com

[فارسی](README.fa.md)

## Requirements

- Node.js **22.13 or newer** (uses the built-in `node:sqlite`; no native modules)
- A synced ParnianCoin node with JSON-RPC enabled (default `127.0.0.1:38003`)
- The **Material Kit** theme SCSS (see [Theme](#theme)) — needed to build the frontend

## Quick start

```bash
git clone https://github.com/parniancoin/parniancoin-explorer.git
cd parniancoin-explorer
npm install
# provide src/assets/material-kit.scss first — see "Theme"
npm run build                     # frontend -> dist/
PARNIAN_RPC=http://127.0.0.1:38003 node server/index.js
# open http://127.0.0.1:38101
```

The backend serves `dist/`, proxies a read-only whitelist of JSON-RPC methods
to the node and indexes new blocks every 60 seconds.

Development with hot reload: `npm run serve` (port 38100, proxies `/rpc` and
`/api` to the backend on 38101); `npm start` runs both together.

## Theme

The original build uses the commercial *Material Kit Pro* theme by Creative
Tim, which **cannot be redistributed and is not included**. `src/App.vue`
imports `src/assets/material-kit.scss`; before building, place there either
your own licensed copy of Material Kit Pro or the free, MIT-licensed
[Material Kit](https://github.com/creativetimofficial/material-kit) SCSS
(rename its main file to `material-kit.scss` and keep its partials folder next
to it). With the free theme a few components may look different.

## Endpoints

Everything is served from one port by the backend in `server/`:

| Path                        | Purpose                                        |
|-----------------------------|------------------------------------------------|
| `POST /rpc`                 | JSON-RPC proxy to the node (same origin, no CORS) |
| `GET /api/last100`          | last 100 blocks with duration and operation count |
| `GET /api/timeline/{daily,weekly,monthly,yearly}` | aggregated chart data     |
| `GET /api/blockcount`       | current block count                            |
| `GET /api/coinsupply`, `/api/accountsupply` | supply figures                 |
| `GET /*`                    | the production build in `dist/`                 |

The frontend reads these paths from `src/config.js`; `VUE_APP_RPC_URL` and
`VUE_APP_API_BASE` override them at build time.

## Explorer backend

`server/` is a small Node service: it serves the built frontend, proxies
JSON-RPC to the node, and answers the aggregation endpoints the charts need.
No PHP, no database server, no native modules.

```
server/
  config.js     endpoints, port, database path
  db.js         SQLite connection and schema
  rpc.js        JSON-RPC client for the node
  indexer.js    walks the chain and fills the database (also a CLI)
  index.js      express app: static frontend + API
  data/         explorer.sqlite, created on the first index run
```

SQLite comes from `node:sqlite`, built into Node 22.13+ and 24, so nothing has
to be compiled or installed. On older Node the code falls back to
`better-sqlite3` if that package happens to be present.

```
npm run build          # build the frontend into dist/
npm run rpc            # serve everything on http://127.0.0.1:38101
```

The backend also indexes new blocks every 60 seconds in the background. To run
the indexer separately instead:

```
npm run index                      # incremental, safe to repeat
npm run index:watch                # keep polling for new blocks
node server/indexer.js --reset     # rebuild from block 0
node server/indexer.js --from=N    # re-index from height N (repairs a fork)
```

Configuration is environment driven, so nothing needs editing to deploy:

| Variable            | Default                 | Meaning                                  |
|---------------------|-------------------------|------------------------------------------|
| `PARNIAN_RPC`       | `http://127.0.0.1:38003`| JSON-RPC address of your node            |
| `PORT`              | `38101`                 | Port the explorer listens on             |
| `PARNIAN_DB`        | `server/data/…sqlite`   | Database file location                   |
| `PARNIAN_AUTOINDEX` | `60`                    | Background indexing interval, `0` to stop|

Routes: `POST /rpc` forwards a read-only whitelist of methods to the node, `GET /api/last100`,
`GET /api/timeline/{daily,weekly,monthly,yearly}` return the chart data, and
`GET /api/status` reports how far the index has got. Everything else falls
through to `dist/index.html` for vue-router's history mode.

Amounts are stored as integer TAR (1 PARC = 10000 TAR) so no rounding drift can
accumulate, and converted to PARC only when a response is built.

Keep the database file out of any publicly served directory. With the bundled
server that is already the case, since only `dist/` is exposed as static files.

## Languages

The interface ships in English, Persian and Arabic. On a first visit the
language is taken from the browser, falling back to English; after that the
visitor's own choice is remembered in local storage.

```
src/i18n/
  index.js            locale detection, switching, document direction
  locales/en.json     the reference catalogue
  locales/fa.json     Persian
  locales/ar.json     Arabic
src/assets/rtl.scss   right-to-left overrides
```

Adding a language means dropping another JSON next to those three, importing
it in `src/i18n/index.js` and adding an entry to `LOCALES` with its `dir`.

Two rules worth keeping when translating:

Sentences are stored whole, with named places, never as fragments glued
together in the template — `"{sender} sent {amount} to {receiver}."` rather
than a "sent" and a "to" that the template concatenates. Persian and Arabic put
the verb and the objects in a different order, so fragments produce nonsense.
The `<i18n path="...">` component fills the places with real components.

Hashes, public keys, account numbers and amounts stay left to right even in the
right-to-left layouts. The bidirectional algorithm otherwise reorders a hex
string and makes it unreadable. `src/assets/rtl.scss` pins them with a `.ltr`
class and on `code`/`pre`.

Persian and Arabic look best with Vazirmatn or Cairo installed; without them the
browser falls back to the platform's own Arabic-script font.

## Client library

`vendor/parniancoin-js/` contains the ParnianCoin javascript client library
(types, key handling, crypto and RPC client). Webpack maps the module name
`parniancoin` onto that folder (see `vue.config.js`), so all imports look like

```js
import Block from 'parniancoin/src/Types/Block';
```

## Production deployment

systemd unit (`/etc/systemd/system/parnian-explorer.service`):

```ini
[Unit]
Description=ParnianCoin Explorer
After=network.target

[Service]
User=parnian
WorkingDirectory=/opt/parniancoin-explorer
Environment=PARNIAN_RPC=http://127.0.0.1:38003
Environment=PORT=38101
ExecStart=/usr/bin/node server/index.js
Restart=always

[Install]
WantedBy=multi-user.target
```

nginx:

```nginx
server {
    listen 80;
    server_name explorer.example.com;
    location / {
        proxy_pass http://127.0.0.1:38101;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Use the production backend (`server/index.js`, port 38101) behind nginx, not
the development server (`npm run serve`). `server/parnian-explorer-reset.sh`
is an example script that wipes the index and restarts the service; adjust its
paths before use.

## Author

**Amir Reza Zamani** — https://parniancoin.com — info@parniancoin.com

## Credits

- Derived from the PascalCoin block explorer and the `pascalcoin` JavaScript
  client library by Benjamin Ansbach (Techworker); the library ships in
  `vendor/parniancoin-js` with its licence file.
- Theme: Material Kit by Creative Tim (not included, see [Theme](#theme)).
- Persian font: Vazirmatn (SIL Open Font License).

## License

Copyright (C) 2026 Amir Reza Zamani. Released under the
[GNU GPL v3](LICENSE).
