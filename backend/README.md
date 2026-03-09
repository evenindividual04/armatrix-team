# Armatrix Team API

FastAPI backend for the Armatrix team page. Manages team member profiles for a deep-tech robotics startup building snake-like robotic arms for industrial inspection.

## Overview

- **Framework**: FastAPI
- **Database**: SQLite (via SQLAlchemy 2.x)
- **Validation**: Pydantic v2
- **Seed data**: 10 team members pre-loaded on first startup

## Setup

```bash
# 1. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run the development server (from the backend/ directory)
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

## Environment Variables

Create a `.env` file in the `backend/` directory to override defaults:

```
DATABASE_URL=sqlite:///./team.db
CORS_ORIGINS=http://localhost:3000
ENV=development
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check with DB connectivity status |
| GET | `/api/team` | List all members (supports `?department=` and `?search=`) |
| GET | `/api/team/stats` | Department counts and total team size |
| GET | `/api/team/{id}` | Get a single team member by ID |
| POST | `/api/team` | Create a new team member |
| PUT | `/api/team/{id}` | Partially update a team member |
| DELETE | `/api/team/{id}` | Delete a team member (returns deleted member) |

### Query Parameters

- `GET /api/team?department=Engineering` — filter by department (`Leadership`, `Engineering`, `Design`, `Operations`)
- `GET /api/team?search=Vishrant` — case-insensitive name search

### Valid Field Values

- `department`: `Leadership`, `Engineering`, `Design`, `Operations`
- `card_size`: `featured`, `wide`, `standard`

## Running Tests

```bash
# From the backend/ directory
pytest

# With verbose output
pytest -v

# Run a specific test file
pytest tests/test_api.py -v
```
