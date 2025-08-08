from datetime import datetime
from typing import Optional, Any, Dict, List
from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    display_name: str = Field(default="Learner", max_length=100)
    preferred_ui_language: str = Field(default="en")


class UserOut(BaseModel):
    id: int
    display_name: str
    preferred_ui_language: str

    class Config:
        from_attributes = True


class StudyEventCreate(BaseModel):
    user_id: int
    activity_type: str
    duration_minutes: float = 0.0
    score: Optional[float] = None
    metadata: Optional[Dict[str, Any]] = None


class StudyEventOut(BaseModel):
    id: int
    user_id: int
    created_at: datetime
    activity_type: str
    duration_minutes: float
    score: Optional[float]
    metadata: Optional[Dict[str, Any]]

    class Config:
        from_attributes = True


class DailyProgress(BaseModel):
    date: str
    total_minutes: float
    activities: Dict[str, float]  # activity_type -> minutes
    average_score: Optional[float] = None


class NHKArticle(BaseModel):
    id: str
    title: str
    link: str
    published: str
    summary: Optional[str] = None


class GenerateFlashcardsRequest(BaseModel):
    jlpt_level: str = Field(default="N5")
    base_language: str = Field(default="en")  # 'en' or 'zh'
    topic: Optional[str] = None
    num_cards: int = Field(default=12, ge=4, le=40)


class Flashcard(BaseModel):
    front: str  # Japanese word or sentence
    back: str   # Meaning in base_language
    reading: Optional[str] = None  # kana reading
    example: Optional[str] = None  # example sentence
    example_translation: Optional[str] = None


class GenerateFlashcardsResponse(BaseModel):
    cards: List[Flashcard]


