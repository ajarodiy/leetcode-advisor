from fastapi import FastAPI
from routes import problem_routes
from routes import insights_routes

app = FastAPI()

app.include_router(problem_routes.router)
app.include_router(insights_routes.router)