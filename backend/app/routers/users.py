from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models
from app.schemas import UserCreate, UserOut

router = APIRouter()


@router.post("/", response_model=UserOut)
def create_user(body: UserCreate, db: Session = Depends(get_db)):
    user = models.User(
        display_name=body.display_name,
        preferred_ui_language=body.preferred_ui_language,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/{user_id}", response_model=UserOut)
def update_user(user_id: int, body: UserCreate, db: Session = Depends(get_db)):
    user = db.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.display_name = body.display_name
    user.preferred_ui_language = body.preferred_ui_language
    db.commit()
    db.refresh(user)
    return user


