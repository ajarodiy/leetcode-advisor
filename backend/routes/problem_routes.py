from fastapi import APIRouter, HTTPException
from models.problem_model import ProblemSubmitRequest
from services.firestore_service import save_problem_attempt

router = APIRouter()

@router.post("/submitAttempt/{user_id}/{problem_slug}")
async def submit_attempt(user_id: str, problem_slug: str, payload: ProblemSubmitRequest):
    try:
        save_problem_attempt(user_id, problem_slug, payload)
        return {"message": "Problem attempt saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))