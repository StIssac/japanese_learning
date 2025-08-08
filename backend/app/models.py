from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    display_name = Column(String(100), nullable=False, default="Learner")
    preferred_ui_language = Column(String(10), nullable=False, default="en")  # 'en' or 'zh'

    events = relationship("StudyEvent", back_populates="user", cascade="all, delete-orphan")


class StudyEvent(Base):
    __tablename__ = "study_events"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    # activity_type examples: flashcards, quiz, reading, handwriting, listening, speaking
    activity_type = Column(String(50), nullable=False)

    # duration in minutes
    duration_minutes = Column(Float, nullable=False, default=0.0)

    # score or accuracy percentage when applicable
    score = Column(Float, nullable=True)

    # arbitrary metadata per activity (e.g., deck name, article id, words learned)
    metadata = Column(JSON, nullable=True)

    user = relationship("User", back_populates="events")


