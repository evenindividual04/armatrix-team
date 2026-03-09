from pydantic import BaseModel, HttpUrl, EmailStr, field_validator, model_validator
from typing import Optional
from datetime import datetime

VALID_DEPARTMENTS = ["Leadership", "Engineering", "Design", "Operations"]
VALID_CARD_SIZES = ["featured", "wide", "standard"]

class TeamMemberBase(BaseModel):
    name: str
    role: str
    department: str
    bio: str = ""
    photo_url: str
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    email: Optional[str] = None
    card_size: str = "standard"
    order: int = 0

    @field_validator("name")
    @classmethod
    def validate_name(cls, v):
        v = v.strip()
        if len(v) < 1 or len(v) > 100:
            raise ValueError("Name must be between 1 and 100 characters")
        return v

    @field_validator("role")
    @classmethod
    def validate_role(cls, v):
        v = v.strip()
        if len(v) < 1 or len(v) > 100:
            raise ValueError("Role must be between 1 and 100 characters")
        return v

    @field_validator("department")
    @classmethod
    def validate_department(cls, v):
        if v not in VALID_DEPARTMENTS:
            raise ValueError(f"Department must be one of: {', '.join(VALID_DEPARTMENTS)}")
        return v

    @field_validator("bio")
    @classmethod
    def validate_bio(cls, v):
        if len(v) > 500:
            raise ValueError("Bio must be 500 characters or fewer")
        return v

    @field_validator("card_size")
    @classmethod
    def validate_card_size(cls, v):
        if v not in VALID_CARD_SIZES:
            raise ValueError(f"card_size must be one of: {', '.join(VALID_CARD_SIZES)}")
        return v

    @field_validator("order")
    @classmethod
    def validate_order(cls, v):
        if v < 0:
            raise ValueError("order must be non-negative")
        return v

class TeamMemberCreate(TeamMemberBase):
    pass

class TeamMemberUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    department: Optional[str] = None
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    email: Optional[str] = None
    card_size: Optional[str] = None
    order: Optional[int] = None

    @field_validator("name")
    @classmethod
    def validate_name(cls, v):
        if v is not None:
            v = v.strip()
            if len(v) < 1 or len(v) > 100:
                raise ValueError("Name must be between 1 and 100 characters")
        return v

    @field_validator("role")
    @classmethod
    def validate_role(cls, v):
        if v is not None:
            v = v.strip()
            if len(v) < 1 or len(v) > 100:
                raise ValueError("Role must be between 1 and 100 characters")
        return v

    @field_validator("department")
    @classmethod
    def validate_department(cls, v):
        if v is not None and v not in VALID_DEPARTMENTS:
            raise ValueError(f"Department must be one of: {', '.join(VALID_DEPARTMENTS)}")
        return v

    @field_validator("bio")
    @classmethod
    def validate_bio(cls, v):
        if v is not None and len(v) > 500:
            raise ValueError("Bio must be 500 characters or fewer")
        return v

    @field_validator("card_size")
    @classmethod
    def validate_card_size(cls, v):
        if v is not None and v not in VALID_CARD_SIZES:
            raise ValueError(f"card_size must be one of: {', '.join(VALID_CARD_SIZES)}")
        return v

    @field_validator("order")
    @classmethod
    def validate_order(cls, v):
        if v is not None and v < 0:
            raise ValueError("order must be non-negative")
        return v

class TeamMemberResponse(TeamMemberBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

class DepartmentStats(BaseModel):
    department: str
    count: int

class StatsResponse(BaseModel):
    total: int
    by_department: list[DepartmentStats]

class HealthResponse(BaseModel):
    status: str
    db_connected: bool
    member_count: int
