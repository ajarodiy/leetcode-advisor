from firebase_setup import db
from models.problem_model import ProblemSubmitRequest
from datetime import datetime
from firebase_admin import firestore

def save_problem_attempt(user_id: str, problem_slug: str, payload: ProblemSubmitRequest):
    ref = db.collection("users").document(user_id).collection("problems").document(problem_slug)

    attempt_entry = payload.attempt.dict()
    attempt_entry["timestamp"] = attempt_entry.get("timestamp") or datetime.utcnow()

    ref.set({
        "title": payload.title,
        "topicTags": payload.tags,
        "averageSolveTime": payload.avgTime,
        "attempts": firestore.ArrayUnion([attempt_entry])
    }, merge=True)