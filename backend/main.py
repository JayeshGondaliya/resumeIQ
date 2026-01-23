from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.resume import router as resume_routes

app = FastAPI(title="ResumeIQ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume_routes, prefix="/api")


@app.get("/")
def root():
    return {"status": " Server is running"}
