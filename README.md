# Armatrix Team Page

A team directory for Armatrix. FastAPI backend, Next.js frontend, deployed on Render + Vercel.

- **Frontend:** https://armatrix-team.vercel.app
- **Backend:** https://armatrix-team.onrender.com

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

API at `http://localhost:8000` — docs at `http://localhost:8000/docs`

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

To point at a remote backend, either prefix the dev command:
```bash
NEXT_PUBLIC_API_URL=https://armatrix-team.onrender.com npm run dev
```
or create `frontend/.env.local`:
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

## Design decisions

I didn't want this to look like a standard corporate team page — clean grid, headshots, LinkedIn icons, done. Armatrix builds robots for confined hazardous environments, so I went with something that feels closer to an industrial HUD or a military briefing document. Dark background (`#080A08`), amber (`#FF9500`) as the only accent colour, monospace type for all UI labels.

**The grid** uses three card sizes — `featured` (2×2), `wide` (2×1), `standard` (1×1) — so the layout itself communicates who the key people are without needing to say it. `grid-auto-flow: dense` keeps it packed without gaps.

**The hero** has an animated SVG donut chart that pulls department breakdown from the API on load. It's the only real data visualisation on the page and it earns its place — shows the team composition at a glance before you've scrolled anywhere.

**Interactions** — a few things I thought were worth doing properly:
- Text scramble on card hover (names cycle through random characters before resolving — gives a data-retrieval feel)
- Grayscale photos that reveal colour on hover, so the grid looks calm at rest
- 3D perspective tilt following the mouse, done with Framer Motion spring physics
- A terminal-style boot sequence that plays once per session and doesn't repeat (stored in `sessionStorage`)

**The modal** opens on any card click and shows the full member detail — bio, social links, full-colour photo. Closes on backdrop click or Escape.

**Admin panel** at `/admin` — no auth as specified. Full CRUD, form validates required fields before submitting.

**Data** — 10 fictional team members are seeded on first backend startup. The seed checks whether the database is empty first, so restarting the server doesn't create duplicates.

---

## Project structure

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
