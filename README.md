# Japanese Learning App (Dockerized, FastAPI + React)

Run full stack with Docker:

1) Set your AI keys (选择其中一个):

**使用 OpenAI:**
```powershell
$env:OPENAI_API_KEY="your_openai_api_key"
```

**或使用 Azure OpenAI:**
```powershell
$env:AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com/"
$env:AZURE_OPENAI_API_KEY="your_azure_api_key"
$env:AZURE_OPENAI_DEPLOYMENT="your_deployment_name"
```

2) Start services:

```powershell
docker compose up --build
```

Services:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api
- Postgres: localhost:5432 (jp_user / jp_password)

Features:
- Progress tracking: POST `/api/progress/event`, view `/api/progress/daily`, `/api/progress/streak`
- NHK Easy articles: GET `/api/resources/nhk-easy`
- AI flashcards: POST `/api/ai/generate_flashcards`
- TTS placeholder: POST `/api/ai/text_to_speech`
- STT (Whisper): POST `/api/ai/speech_to_text`

Frontend pages:
- Dashboard, Flashcards, Reading, Listening, Speaking, Handwriting, Quizzes
- Theme switcher (DaisyUI), i18n (EN/ZH)

Notes:
- Default user created at startup; frontend stores `user_id=1` in local storage.
- 只需配置一个AI服务：OpenAI 或 Azure OpenAI
- 优先使用 Azure OpenAI 配置，如果未配置则使用 OpenAI