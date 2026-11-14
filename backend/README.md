# Portfolio Flask API

## Run locally (Windows PowerShell)

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

The API runs at `http://127.0.0.1:5000`. Check `http://127.0.0.1:5000/health`.

## Configure the frontend

In `../assets/js/config.js`, set:

```js
window.PORTFOLIO_CONFIG = {
  API_URL: "http://127.0.0.1:5000"
};
```

Run the frontend using VS Code Live Server (usually `http://127.0.0.1:5500`). The backend allows that local origin by default.

## Deploy on Render

1. Push this project to a GitHub repository.
2. In Render, create **New + > Web Service** and connect the repository.
3. Set **Root Directory** to `backend`.
4. Set **Build Command** to `pip install -r requirements.txt`.
5. Set **Start Command** to `gunicorn app:app`.
6. Add `CORS_ORIGINS` with your exact deployed frontend origin, for example `https://your-site.vercel.app` (no trailing slash).
7. Deploy, then open `https://YOUR-SERVICE.onrender.com/health` and confirm it returns `healthy`.
8. Copy the Render service URL into `assets/js/config.js` as `API_URL`, commit and push the change, then redeploy the frontend.

## Message storage and email notifications

Every valid message is stored in a SQLite database. To receive an email notification too, add the SMTP variables shown in `.env.example` in Render's Environment settings. For Gmail, use a Google App Password, not your normal account password. Never commit `.env` or passwords to GitHub.

Render's ordinary local filesystem may be temporary on free instances. For durable SQLite storage, attach a persistent disk and set `DATABASE_PATH` to a file under its mount path (persistent disks may require a paid service). Email notifications are recommended so messages reach your inbox.

## API

- `GET /` — service status
- `GET /health` — health check
- `POST /api/contact` — accepts JSON: `name`, `email`, `subject`, `message`, and optional honeypot `website`

The API validates inputs, applies a basic per-process rate limit, uses parameterized SQL, and only permits configured CORS origins. For production at larger scale, use a shared rate-limit store and a managed database.
