# Armatrix Team Page

A full-stack team directory for Armatrix — a deep-tech robotics startup building snake-like robotic arms for confined hazardous environments.

**Live links (fill in after deployment):**
- Frontend: `https://YOUR_APP.vercel.app`
- Backend: `https://YOUR_API.onrender.com`

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React, Framer Motion, Tailwind CSS |
| Backend | Python 3.11+, FastAPI, SQLAlchemy 2.x, SQLite, Pydantic v2 |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Local Setup

### Prerequisites
- Node.js 18+
- Python 3.11+

### Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload
```

API available at `http://localhost:8000`
Interactive docs at `http://localhost:8000/docs`

Optional — create `backend/.env` to override defaults:
```
DATABASE_URL=sqlite:///./team.db
CORS_ORIGINS=http://localhost:3000
ENV=development
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

App available at `http://localhost:3000`

To point the frontend at a deployed backend, set the env variable before running:
```bash
NEXT_PUBLIC_API_URL=https://your-api.onrender.com npm run dev
```

Or create a `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-api.onrender.com
```

### Running Tests

```bash
cd backend
pytest              # all 47 tests
pytest -v           # verbose output
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

## Design Decisions

### Visual direction — "Operational Dossier"
Rather than a standard light-mode grid, the page takes cues from military briefing documents and industrial HUDs. The palette is near-black (`#080A08`) with amber (`#FF9500`) as the single accent colour — chosen because amber reads as alert/precision, fitting for a company building equipment for hazardous environments. Everything else is a studied grey scale.

### Bento grid with three card types
Team members are assigned a `card_size` — `featured` (2×2), `wide` (2×1), or `standard` (1×1) — allowing the grid to communicate hierarchy visually. Founders get featured cards, senior engineers get wide cards, and the rest are standard. The grid uses CSS `grid-auto-flow: dense` so it packs efficiently without gaps.

### Interactions
- **Boot sequence** — a terminal-style animation plays once per session (stored in `sessionStorage`) so it doesn't become annoying on repeat visits
- **3D tilt** — cards respond to mouse position with a subtle perspective tilt using Framer Motion spring physics
- **Text scramble** — hovering a standard card scrambles the name briefly before resolving, giving a data-retrieval feel
- **Grayscale reveal** — photos start desaturated and reveal colour on card hover, keeping the grid visually quiet at rest
- **Marquee ticker** — a scrolling info strip between the filter and grid reinforces the operational aesthetic

### Card detail modal
Clicking any card opens a full-detail modal with bio, social links, and the photo in full colour (no grayscale filter). Dismisses via backdrop click or Escape key.

### Department filter
Client-side filtering with an animated underline indicator (Framer Motion `layoutId`). Counts shown per department update reactively.

### Admin panel (`/admin`)
No auth — as specified. Full CRUD via the same REST API. The form validates required fields (name, role, photo URL) before submitting. All operations trigger a refresh of the member list.

### Data
10 fictional but plausible team members are seeded on first backend startup. The seed only runs if the database is empty, so restarting the server doesn't duplicate data.

### Typography
- **Barlow Condensed 800** — display headings and names (condensed width keeps large text from dominating)
- **JetBrains Mono** — labels, badges, and UI chrome (reinforces the technical/terminal aesthetic)
- **Barlow 400/500** — body copy and descriptions

---

## Project Structure

```
armatrix-task/
├── backend/
│   ├── app/
│   │   ├── main.py        # FastAPI app, CORS, startup
│   │   ├── routes.py      # All API route handlers
│   │   ├── models.py      # SQLAlchemy ORM models
│   │   ├── schemas.py     # Pydantic request/response schemas
│   │   ├── crud.py        # Database operations
│   │   ├── database.py    # Engine + session setup
│   │   ├── seed.py        # Initial team member data
│   │   └── config.py      # Environment variable loading
│   ├── tests/
│   │   └── test_api.py    # 47 endpoint tests
│   └── requirements.txt
└── frontend/
    ├── app/
    │   ├── team/page.tsx  # Main team page
    │   ├── admin/page.tsx # Admin CRUD page
    │   └── globals.css    # Design system tokens + global styles
    ├── components/        # All UI components
    ├── lib/api.ts         # Typed API client
    └── types/index.ts     # Shared TypeScript types
```
