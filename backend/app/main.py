from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import progress, resources, ai, users
from app.database import SessionLocal
from app import models

app = FastAPI(title="JP Learning API", version="0.1.0")

# In Docker, frontend will proxy /api to backend via nginx. Allow CORS for local dev too.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health():
    return {"status": "ok"}

app.include_router(progress.router, prefix="/api/progress", tags=["progress"])
app.include_router(resources.router, prefix="/api/resources", tags=["resources"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
app.include_router(users.router, prefix="/api/users", tags=["users"])


@app.on_event("startup")
def ensure_default_user():
    db = SessionLocal()
    try:
        user = db.query(models.User).first()
        if not user:
            user = models.User(display_name="Learner", preferred_ui_language="en")
            db.add(user)
            db.commit()
    finally:
        db.close()


