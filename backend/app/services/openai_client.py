import base64
import json
import os
from typing import List, Optional

from openai import OpenAI


class OpenAIHelper:
    """Wrapper around OpenAI Python SDK for chat, TTS, and STT."""

    def __init__(self):
        # 优先使用 Azure OpenAI，如果没有配置则使用 OpenAI
        azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
        azure_api_key = os.getenv("AZURE_OPENAI_API_KEY")
        azure_deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT")
        
        if azure_endpoint and azure_api_key and azure_deployment:
            # 使用 Azure OpenAI
            self.client = OpenAI(
                api_key=azure_api_key,
                azure_endpoint=azure_endpoint,
                azure_deployment=azure_deployment,
                api_version="2024-02-15-preview"
            )
        else:
            # 使用 OpenAI
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                raise ValueError("需要配置 OPENAI_API_KEY 或 Azure OpenAI 参数")
            self.client = OpenAI(api_key=api_key)

    def generate_flashcards(
        self,
        jlpt_level: str = "N5",
        base_language: str = "en",
        topic: Optional[str] = None,
        num_cards: int = 12,
    ) -> List[dict]:
        system = (
            "You are a Japanese language tutor creating concise flashcards for JLPT learners. "
            "Return STRICT JSON with the schema {cards: [{front, back, reading?, example?, example_translation?}]} without any extra text."
        )
        topic_part = f" on the topic '{topic}'" if topic else ""
        prompt = (
            f"Create {num_cards} high-quality JLPT {jlpt_level} flashcards{topic_part}. "
            f"Front must be Japanese (kanji or kana) with natural usage. Back must be {base_language}. "
            "Include 'reading' in kana when front has kanji. Provide an 'example' sentence in Japanese and 'example_translation' in the base language. "
            "Avoid romaji. Keep definitions succinct."
        )
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            response_format={"type": "json_object"},
        )
        content = response.choices[0].message.content
        data = json.loads(content)
        cards = data.get("cards", [])
        return cards

    def text_to_speech(self, text: str) -> str:
        """Return base64-encoded MP3 audio for given Japanese text."""
        # Placeholder base64 encoding; replace with official TTS when generally available
        return base64.b64encode(text.encode("utf-8")).decode("utf-8")

    def speech_to_text(self, audio_bytes: bytes, filename: Optional[str] = None) -> str:
        # Whisper transcription
        from io import BytesIO

        audio_file = BytesIO(audio_bytes)
        audio_file.name = filename or "audio.webm"
        transcript = self.client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
        )
        return transcript.text


