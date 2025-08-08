from collections import defaultdict
from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db, Base, engine
from app import models
from app.schemas import StudyEventCreate, StudyEventOut, DailyProgress


router = APIRouter()


# Create tables on first import (simple migration strategy for MVP)
Base.metadata.create_all(bind=engine)


@router.post("/event", response_model=StudyEventOut)
def log_event(payload: StudyEventCreate, db: Session = Depends(get_db)):
    # Ensure user exists or create a default one if id=1 special case
    user = db.get(models.User, payload.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    event = models.StudyEvent(
        user_id=payload.user_id,
        activity_type=payload.activity_type,
        duration_minutes=payload.duration_minutes,
        score=payload.score,
        metadata=payload.metadata,
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@router.get("/daily", response_model=List[DailyProgress])
def get_daily_progress(days: int = 30, db: Session = Depends(get_db)):
    # Aggregate by date
    events = (
        db.query(
            func.date(models.StudyEvent.created_at).label("date"),
            models.StudyEvent.activity_type,
            func.sum(models.StudyEvent.duration_minutes).label("minutes"),
            func.avg(models.StudyEvent.score).label("avg_score"),
        )
        .group_by(func.date(models.StudyEvent.created_at), models.StudyEvent.activity_type)
        .order_by(func.date(models.StudyEvent.created_at).desc())
        .limit(days * 6)
        .all()
    )

    day_to_minutes = defaultdict(float)
    day_to_activities = defaultdict(lambda: defaultdict(float))
    day_to_scores = defaultdict(list)

    for date_val, activity, minutes, avg_score in events:
        date_str = str(date_val)
        day_to_minutes[date_str] += float(minutes or 0)
        day_to_activities[date_str][activity] += float(minutes or 0)
        if avg_score is not None:
            day_to_scores[date_str].append(float(avg_score))

    output = []
    for date_str in sorted(day_to_minutes.keys(), reverse=True)[:days]:
        scores = day_to_scores.get(date_str, [])
        output.append(
            DailyProgress(
                date=date_str,
                total_minutes=round(day_to_minutes[date_str], 2),
                activities={k: round(v, 2) for k, v in day_to_activities[date_str].items()},
                average_score=(round(sum(scores) / len(scores), 2) if scores else None),
            )
        )
    return list(reversed(output))


@router.get("/streak")
def get_streak(db: Session = Depends(get_db)):
    # Count consecutive days with at least some study time
    rows = (
        db.query(func.date(models.StudyEvent.created_at).label("date"), func.sum(models.StudyEvent.duration_minutes))
        .group_by(func.date(models.StudyEvent.created_at))
        .order_by(func.date(models.StudyEvent.created_at).desc())
        .all()
    )
    today = datetime.utcnow().date()
    streak = 0
    for i, (date_val, total_minutes) in enumerate(rows):
        if total_minutes is None or total_minutes <= 0:
            continue
        day = date_val
        if i == 0 and day in (today, today):
            streak = 1
            prev = day
            continue
        if i == 0 and day == today:
            streak = 1
            prev = day
            continue
        if (prev - day).days == 1:
            streak += 1
            prev = day
        else:
            break
    return {"streak_days": streak}


