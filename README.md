# Portfolio

This repository contains a personal portfolio website split into two parts:

- `frontend/` — static website (HTML, CSS, JS, assets, and data files).
- `backend/` — Node.js + Express server that handles the contact form and serves the frontend in development.

Backend features
- `POST /api/contact` — accepts JSON `{ name, email, message }`.
- Sends email via `nodemailer` when SMTP env vars are provided, otherwise appends submissions to `backend/submissions.json` as a fallback.

Quick start (development)

1. Install backend dependencies

```powershell
cd backend
npm install
```

2. Copy `.env.example` to `.env` and set SMTP values if you want emails sent.

3. Run the server (serves frontend from `../frontend`)

```powershell
npm run dev
```

4. Open `http://localhost:3000` in your browser.

Environment variables
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `TO_EMAIL` — optional for email sending.
- `PORT` — server port (default 3000).

Notes
- The frontend is a static site inside `frontend/`. You can deploy it separately (Vercel, Netlify) and point the contact form to the backend `POST /api/contact` endpoint.
- The repository includes a simple sitemap and robots file in `frontend/`.
