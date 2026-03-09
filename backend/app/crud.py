from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from . import models, schemas

def get_members(db: Session, department: Optional[str] = None, search: Optional[str] = None):
    query = db.query(models.TeamMember)
    if department:
        query = query.filter(models.TeamMember.department == department)
    if search:
        query = query.filter(models.TeamMember.name.ilike(f"%{search}%"))
    return query.order_by(models.TeamMember.order).all()

def get_member(db: Session, member_id: int):
    return db.query(models.TeamMember).filter(models.TeamMember.id == member_id).first()

def create_member(db: Session, member: schemas.TeamMemberCreate):
    db_member = models.TeamMember(**member.model_dump())
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

def update_member(db: Session, member_id: int, member: schemas.TeamMemberUpdate):
    db_member = get_member(db, member_id)
    if not db_member:
        return None
    update_data = member.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_member, key, value)
    db.commit()
    db.refresh(db_member)
    return db_member

def delete_member(db: Session, member_id: int):
    db_member = get_member(db, member_id)
    if not db_member:
        return None
    db.delete(db_member)
    db.commit()
    return db_member

def get_stats(db: Session):
    total = db.query(func.count(models.TeamMember.id)).scalar()
    by_dept = (
        db.query(models.TeamMember.department, func.count(models.TeamMember.id).label("count"))
        .group_by(models.TeamMember.department)
        .all()
    )
    return {
        "total": total,
        "by_department": [{"department": d, "count": c} for d, c in by_dept]
    }
