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

def get_user_data_for_insights(user_id: str):
    problem_ref = db.collection("users").document(user_id).collection("problems")
    docs = problem_ref.stream()

    problems_raw = []
    for doc in docs:
        data = doc.to_dict()
        attempts = data.get("attempts", [])
        latest_ts = max(
            (a.get("timestamp") for a in attempts if a.get("timestamp")),
            default=None
        )
        problems_raw.append((latest_ts, {
            "title": data.get("title"),
            "tags": data.get("topicTags", []),
            "averageSolveTime": data.get("averageSolveTime"),
            "attempts": attempts
        }))

    problems_raw.sort(key=lambda x: x[0] or datetime.min, reverse=True)
    problems = [p for _, p in problems_raw[:5]]

    insight_ref = db.collection("users").document(user_id).collection("insights")
    insight_docs = insight_ref.order_by("timestamp", direction=firestore.Query.DESCENDING).limit(5).stream()
    insights = [doc.to_dict().get("text", "") for doc in insight_docs]

    return problems, insights

def save_insight(user_id: str, text: str):
    user_ref = db.collection("users").document(user_id)

    user_ref.collection("insights").add({
        "text": text,
        "timestamp": datetime.utcnow()
    })

    user_ref.set({"lastInsightAt": datetime.utcnow()}, merge=True)