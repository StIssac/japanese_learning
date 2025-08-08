from fastapi import APIRouter, HTTPException
from app.schemas import NHKArticle
from app.services.nhk_easy import fetch_nhk_easy_feed
from typing import List

router = APIRouter()


@router.get("/nhk-easy", response_model=List[NHKArticle])
def nhk_easy_latest(limit: int = 20):
    try:
        return fetch_nhk_easy_feed(limit=limit)
    except Exception as exc:  # pragma: no cover - network errors
        raise HTTPException(status_code=502, detail=str(exc))


