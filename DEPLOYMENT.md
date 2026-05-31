Deploying frontend to Vercel and backend to Render

Overview
- Frontend: static site in `frontend/` (HTML/CSS/JS). Deploy to Vercel for fast global CDN hosting.
- Backend: Node/Express app in `backend/`. Deploy to Render (or similar) since it runs a server and may need environment variables.

1) Vercel (frontend)
- In Vercel, click "New Project" → Import Git Repository → select this repo.
- During setup set:
  - Root Directory: `frontend`
  - Framework Preset: `Other`
  - Build Command: leave empty (no build step).
  - Output Directory: leave empty (static files served from the folder root).
- Deploy. Vercel will serve static files and assign a URL like `https://your-project.vercel.app`.

Notes:
- If you later add a frontend build step (React/Vite/etc.), update the Build Command and Output Directory accordingly.
- To use a custom domain, add it in Vercel dashboard and configure DNS.

2) Render (backend)
- In Render dashboard, create a new Blueprint and connect the GitHub repo.
- This repo includes `render.yaml`, so Render can auto-create the backend service config.
- Set:
  - Environment: `Node`
  - Branch: `main`
  - Root Directory: `backend`
  - Build Command: `npm ci`
  - Start Command: `npm start` (or `node server.js`)
- Add Environment Variables in Render (Dashboard -> Environment):
  - `PORT` (optional, Render will set this automatically)
  - `FRONTEND_ORIGIN` (required for CORS, e.g. `https://your-project.vercel.app`)
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (if you want email sending)
  - `TO_EMAIL` (recipient address for contact emails)
- Deploy. Render will build and run the backend, and expose a public URL (e.g., `https://portfolio-backend.onrender.com`).

3) Pointing the frontend form to the backend
- Frontend now reads `FORM_ENDPOINT` from `frontend/config.json`.
- After deploying backend, update `frontend/config.json`:

```json
{
  "FORM_ENDPOINT": "https://portfolio-backend.onrender.com/api/contact"
}
```

- Since frontend on Vercel and backend on Render are different origins, set `FRONTEND_ORIGIN` in Render to your Vercel URL.

4) Additional recommendations
- Add CORS restriction in `backend/server.js` to allow only your frontend origin for production (use the `cors` options or environment variable).
- Store production secrets in Render environment variables — never commit them to the repo.
- Optionally configure a health check endpoint (e.g., `/ping`) and enable Render's health checks.

5) CI notes
- I added a GitHub Actions workflow at `.github/workflows/ci.yml` that installs backend deps and runs `lint`/`test` scripts if present in `backend/package.json`.
- You can expand this workflow to add frontend checks (build/test), security scans, or automated deployment triggers to Render/Vercel if you prefer.

Need help wiring Vercel/Render with GitHub? I can provide the exact settings and help connect them step-by-step (you'll need to authorize Vercel/Render to access the repo).