from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from utils.pdf_extractor import extract_text_from_pdf, ScannedPDFError
from utils.gemini_client import extract_resume_json_with_openrouter
from utils.job_parser import extract_job_json_with_openrouter
from utils.ats_score import calculate_ats_score
from utils.resume_improvements import generate_resume_improvements
from utils.role_suggestor import suggest_top_roles
from utils.current_level import detect_current_level
from utils.generate_roadmap import generate_roadmap_using_openrouter
import os
import shutil

app = FastAPI(title="ResumeIQ API")

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Save PDF temporarily


async def save_pdf(file: UploadFile) -> str:
    pdf_path = f"temp_{file.filename}"
    with open(pdf_path, "wb") as f:
        content = await file.read()
        f.write(content)
    return pdf_path


# Process the resume PDF
def process_resume(pdf_path: str, job_title: str = "Mern Stack devloper") -> dict:
    try:
        raw_text = extract_text_from_pdf(pdf_path)
        cleaned_text = extract_resume_json_with_openrouter(raw_text)
        job_json = extract_job_json_with_openrouter(job_title)
        ats_score = calculate_ats_score(cleaned_text, job_json)
        improvements = generate_resume_improvements(
            cleaned_text, job_json, ats_score
        )
        roles = suggest_top_roles(cleaned_text, ats_score)
        level = detect_current_level(cleaned_text, ats_score)
        roadmap = generate_roadmap_using_openrouter(
            job_title, ats_score, improvements, level
        )

        score = ats_score.get("final_score", 0)
        ats_passed = score >= 60

        return {
            "ats_passed": ats_passed,
            "final_score": score,
            "cleaned_resume": cleaned_text,
            "job_json": job_json,
            "ats_score": ats_score,
            "improvements": improvements,
            "top_roles": roles.get("top_roles", []),
            "current_level": level,
            "roadmap": roadmap
        }

    except ScannedPDFError as e:
        return {"error": f"Scanned PDF Error: {str(e)}"}
    except Exception as e:
        return {"error": f"Unexpected Error: {str(e)}"}
    finally:
        if os.path.exists(pdf_path):
            os.remove(pdf_path)


# -----------------------------
# API endpoint: job_title now required
# -----------------------------
@app.post("/api/upload")
async def upload_resume(
    file: UploadFile = File(...),
    job_title: str = Form(...)  # <-- required, no default
):
    try:
        # Optional check if frontend forgets to send job_title
        if not job_title.strip():
            return JSONResponse({"error": "Job title is required"}, status_code=400)

        pdf_path = await save_pdf(file)
        result = process_resume(pdf_path, job_title)
        # print("job title:"+job_title)

        print("result:", result)
        return JSONResponse(result)

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
