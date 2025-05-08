from fastapi import APIRouter, HTTPException, Depends, Request
from services.firestore_service import get_user_data_for_insights, save_insight
from services.openai_service import generate_insights
from firebase_setup import db
from datetime import datetime
from auth_utils import verify_token

router = APIRouter()

@router.get("/user-insights/{user_id}")
async def get_user_insights(user_id: str, uid: str = Depends(verify_token)):
    if user_id != uid:
        raise HTTPException(status_code=403, detail="Access denied")
    try:
        user_ref = db.collection("users").document(user_id)
        user_doc = user_ref.get()

        should_generate = False
        if user_doc.exists:
            data = user_doc.to_dict()
            last_ts = data.get("lastInsightAt")
            last_active = data.get("lastActiveAt")

            delta_hours = (
                (datetime.utcnow() - last_ts).total_seconds() / 3600
                if last_ts else None
            )
            recently_active = (
                (datetime.utcnow() - last_active).total_seconds() / 60
                if last_active else None
            )

            should_generate = (
                (delta_hours is None or delta_hours >= 2) and
                (recently_active is not None and recently_active <= 15)
            )

        if should_generate:
            problems, past_insights = get_user_data_for_insights(user_id)
            insights_text = generate_insights(problems, past_insights)

            for line in insights_text.split('\n'):
                if line.strip():
                    save_insight(user_id, line.strip())
        else:
            # Get past insights only
            insights_ref = user_ref.collection("insights").order_by("timestamp", direction=db.DESCENDING).limit(5)
            docs = insights_ref.stream()
            insights_text = "\n".join([doc.to_dict().get("text", "") for doc in docs])

        return {"insights": insights_text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/updateActivity/{user_id}")
async def update_user_activity(user_id: str, uid: str = Depends(verify_token)):
    if user_id != uid:
        raise HTTPException(status_code=403, detail="Access denied")
    try:
        user_ref = db.collection("users").document(user_id)
        user_ref.set({ "lastActiveAt": datetime.utcnow() }, merge=True)
        return {"message": "Activity updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))