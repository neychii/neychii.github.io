# JustNeychii Site — Node.js Backend

All page data (profile, playlist, gallery counts, etc.) is now saved to `data.json`
on the server so every visitor sees the same content.

---

## Project Structure

```
neychii-site/
├── server.js          ← Express backend
├── package.json
├── data.json          ← Auto-created on first run (DO NOT commit this)
├── .gitignore
└── public/            ← Everything the browser loads
    ├── index.html
    ├── style.css
    ├── script.js
    └── Assets/
        ├── Images/
        └── Audios/
```

---

## Setup

### 1. Install Node.js
Download from https://nodejs.org (v18 or newer).

### 2. Copy your files into `public/`
Move your existing `index.html`, `style.css`, and `Assets/` folder into the `public/` directory.
The new `script.js` in `public/` replaces your old one — **do not overwrite it**.

### 3. Install dependencies
```bash
cd neychii-site
npm install
```

### 4. Start the server
```bash
npm start
```

Open http://localhost:3000 in your browser.

### 5. (Optional) Auto-restart on file changes during development
```bash
npm run dev
```
This uses Node's built-in `--watch` flag (Node 18+), no extra tools needed.

---

## Deployment

### Option A — Any VPS (recommended)
1. Copy the project to your server (e.g. via `scp` or `git clone`)
2. `npm install --omit=dev`
3. Use **PM2** to keep it running:
   ```bash
   npm install -g pm2
   pm2 start server.js --name neychii
   pm2 save
   pm2 startup   # follow the printed command to auto-start on reboot
   ```
4. Point a reverse proxy (nginx / Caddy) at `localhost:3000`

#### Minimal nginx config
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass         http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Then add HTTPS with `certbot --nginx`.

### Option B — Railway / Render / Fly.io
These platforms run Node apps natively.

1. Push to GitHub (make sure `data.json` is in `.gitignore`)
2. Connect the repo to the platform
3. Set the start command to `node server.js`
4. Add a persistent disk/volume mounted at the project root so `data.json` survives deploys

---

## How it works

| Old (localStorage)       | New (server API)                  |
|--------------------------|-----------------------------------|
| Data stored per-browser  | Data stored in `data.json`        |
| Changes invisible to others | Every visitor sees the same data |
| No auth on saves         | Saves require a valid admin token |

### API endpoints

| Method | Path                  | Auth?  | Description                        |
|--------|-----------------------|--------|------------------------------------|
| GET    | `/api/data`           | No     | Returns all public data            |
| POST   | `/api/login`          | No     | `{ password }` → `{ token }`       |
| POST   | `/api/logout`         | Token  | Invalidates session token          |
| POST   | `/api/data`           | Token  | Saves full data object             |
| POST   | `/api/changepassword` | Token  | `{ currentPassword, newPassword }` |

Admin sessions last **8 hours** and are stored in `sessionStorage` (cleared when tab closes).

---

## Changing the default password

The default password is `neychii`. Change it by logging into the admin panel and
using the **Password** tab, or by editing `data.json` directly:

```json
{
  "password": "your-new-password-here",
  ...
}
```

---

## What stays in localStorage (per-visitor)

- **Theme** (dark/light) — each visitor picks their own, not synced
