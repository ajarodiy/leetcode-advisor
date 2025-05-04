from fastapi import Header, HTTPException, Depends
from firebase_admin import auth as firebase_auth

def verify_token(authorization: str = Header(...)):
    try:
        if not authorization.startswith("Bearer "):
            raise ValueError("Invalid token format")
        token = authorization.split(" ")[1]
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token['uid']
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or missing Firebase token")
