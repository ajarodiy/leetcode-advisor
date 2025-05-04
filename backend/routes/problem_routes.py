from fastapi import APIRouter, HTTPException, Depends
from models.problem_model import ProblemSubmitRequest
from services.firestore_service import save_problem_attempt
from auth_utils import verify_token

router = APIRouter()

@router.post("/submitAttempt/{user_id}/{problem_slug}")
async def submit_attempt(user_id: str, problem_slug: str, payload: ProblemSubmitRequest, uid: str = Depends(verify_token)):
    if user_id != uid:
        raise HTTPException(status_code=403, detail="Access denied")
    try:
        save_problem_attempt(user_id, problem_slug, payload)
        return {"message": "Problem attempt saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))