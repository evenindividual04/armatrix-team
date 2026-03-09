from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from . import crud, schemas
from .database import get_db

router = APIRouter(prefix="/api")

@router.get("/health", response_model=schemas.HealthResponse)
def health_check(db: Session = Depends(get_db)):
    """Health check endpoint including DB connectivity."""
    try:
        from sqlalchemy import text
        db.execute(text("SELECT 1"))
        from . import models
        count = db.query(models.TeamMember).count()
        return {"status": "ok", "db_connected": True, "member_count": count}
    except Exception:
        return {"status": "degraded", "db_connected": False, "member_count": 0}

@router.get("/team/stats", response_model=schemas.StatsResponse)
def get_stats(db: Session = Depends(get_db)):
    """Get department counts and total team size."""
    return crud.get_stats(db)

@router.get("/team", response_model=List[schemas.TeamMemberResponse])
def list_members(
    department: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """List all team members, optionally filtered by department or searched by name."""
    return crud.get_members(db, department=department, search=search)

@router.get("/team/{member_id}", response_model=schemas.TeamMemberResponse)
def get_member(member_id: int, db: Session = Depends(get_db)):
    """Get a single team member by ID."""
    member = crud.get_member(db, member_id)
    if not member:
        raise HTTPException(status_code=404, detail=f"Team member with id {member_id} not found")
    return member

@router.post("/team", response_model=schemas.TeamMemberResponse, status_code=201)
def create_member(member: schemas.TeamMemberCreate, db: Session = Depends(get_db)):
    """Create a new team member."""
    return crud.create_member(db, member)

@router.put("/team/{member_id}", response_model=schemas.TeamMemberResponse)
def update_member(member_id: int, member: schemas.TeamMemberUpdate, db: Session = Depends(get_db)):
    """Update an existing team member (partial update supported)."""
    updated = crud.update_member(db, member_id, member)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Team member with id {member_id} not found")
    return updated

@router.delete("/team/{member_id}", response_model=schemas.TeamMemberResponse)
def delete_member(member_id: int, db: Session = Depends(get_db)):
    """Delete a team member and return the deleted member."""
    deleted = crud.delete_member(db, member_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=f"Team member with id {member_id} not found")
    return deleted
