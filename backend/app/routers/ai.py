from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import List

from app.schemas import GenerateFlashcardsRequest, GenerateFlashcardsResponse, Flashcard
from app.services.openai_client import OpenAIHelper

router = APIRouter()


@router.post("/generate_flashcards", response_model=GenerateFlashcardsResponse)
def generate_flashcards(body: GenerateFlashcardsRequest):
    helper = OpenAIHelper()
    try:
        cards = helper.generate_flashcards(
            jlpt_level=body.jlpt_level,
            base_language=body.base_language,
            topic=body.topic,
            num_cards=body.num_cards,
        )
        return {"cards": cards}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/text_to_speech")
async def text_to_speech(text: str = Form(...)):
    helper = OpenAIHelper()
    try:
        audio_bytes = helper.text_to_speech(text)
        return {"audio_base64": audio_bytes}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/speech_to_text")
async def speech_to_text(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="Missing audio file")
    helper = OpenAIHelper()
    try:
        content = await file.read()
        transcript = helper.speech_to_text(content, filename=file.filename)
        return {"transcript": transcript}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


