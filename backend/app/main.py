import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .config import settings
from .database import engine, SessionLocal, Base
from .routes import router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up Armatrix API...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        from .seed import seed_database
        seed_database(db)
        logger.info("Database seeded successfully")
    finally:
        db.close()
    yield
    # Shutdown
    logger.info("Shutting down Armatrix API...")

app = FastAPI(
    title="Armatrix Team API",
    description="API for managing Armatrix team members",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unexpected error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Please try again later."}
    )

app.include_router(router)
