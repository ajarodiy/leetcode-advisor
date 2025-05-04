from fastapi import FastAPI
from routes import problem_routes

app = FastAPI()

app.include_router(problem_routes.router)