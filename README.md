# Armatrix Team Page

A full-stack team directory for Armatrix — a deep-tech robotics startup building snake-like robotic arms for confined hazardous environments.

- **Frontend:** `https://YOUR_APP.vercel.app`
- **Backend:** `https://armatrix-team.onrender.com`

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React, Framer Motion, Tailwind CSS |
| Backend | Python 3.11+, FastAPI, SQLAlchemy 2.x, SQLite, Pydantic v2 |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Local Setup

**Prerequisites:** Node.js 18+, Python 3.11+

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API at `http://localhost:8000` — interactive docs at `http://localhost:8000/docs`

Optional `backend/.env`:
```
DATABASE_URL=sqlite:///./team.db
CORS_ORIGINS=http://localhost:3000
ENV=development
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App at `http://localhost:3000`

To point at a deployed backend:
```bash
NEXT_PUBLIC_API_URL=https://armatrix-team.onrender.com npm run dev
```

Or create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=https://armatrix-team.onrender.com
```

### Tests

```bash
cd backend
pytest        # 47 tests
pytest -v     # verbose
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check + DB status |
| GET | `/api/team` | List all members (`?department=` `?search=`) |
| GET | `/api/team/stats` | Department counts + total |
| GET | `/api/team/{id}` | Single member by ID |
| POST | `/api/team` | Create a member |
| PUT | `/api/team/{id}` | Update a member |
| DELETE | `/api/team/{id}` | Delete a member |

Valid `department` values: `Leadership`, `Engineering`, `Design`, `Operations`
Valid `card_size` values: `featured`, `wide`, `standard`

---

## Design

### Visual direction — "Operational Dossier"
Near-black background (`#080A08`) with amber (`#FF9500`) as the sole accent. Amber reads as alert/precision — fitting for equipment built for hazardous environments. Typography: Barlow Condensed 800 for display, JetBrains Mono for UI chrome, Barlow for body copy.

### Bento grid
Three card sizes — `featured` (2×2), `wide` (2×1), `standard` (1×1) — communicate hierarchy visually. CSS `grid-auto-flow: dense` keeps the layout gap-free.

### Interactions
- **Boot sequence** — terminal-style animation on first visit per session (`sessionStorage`)
- **3D tilt** — cards respond to mouse position with spring-physics perspective tilt
- **Text scramble** — hovering any card scrambles the name briefly before resolving, giving a data-retrieval feel
- **Grayscale reveal** — photos start desaturated, reveal colour on hover
- **Department arc chart** — animated SVG donut in the hero shows department breakdown, drawn live from the API
- **Marquee ticker** — scrolling info strip between filter and grid

### Modal
Clicking any card opens a full-detail modal with bio, social links, and full-colour photo. Dismisses on backdrop click or Escape.

### Department filter
Client-side filtering with an animated amber underline indicator (`layoutId`). Counts update reactively.

### Admin panel (`/admin`)
No auth — as specified. Full CRUD via the REST API. Validates required fields before submitting.

### Data
10 fictional team members seeded on first backend startup. Seed only runs on an empty database.

---

## Project Structure

```
armatrix-task/
├── backend/
│   ├── app/
│   │   ├── main.py        # FastAPI app, CORS, startup
│   │   ├── routes.py      # API route handlers
│   │   ├── models.py      # SQLAlchemy ORM models
│   │   ├── schemas.py     # Pydantic request/response schemas
│   │   ├── crud.py        # Database operations
│   │   ├── database.py    # Engine + session setup
│   │   ├── seed.py        # Initial team data
│   │   └── config.py      # Environment config
│   ├── tests/
│   │   └── test_api.py    # 47 endpoint tests
│   └── requirements.txt
└── frontend/
    ├── app/
    │   ├── team/page.tsx  # Main team page
    │   ├── admin/page.tsx # Admin CRUD page
    │   └── globals.css    # Design tokens + global styles
    ├── components/        # All UI components
    ├── hooks/             # useTextScramble
    ├── lib/api.ts         # Typed API client
    └── types/index.ts     # Shared TypeScript types
```
