import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
import os

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=400, detail="Only PDF files are allowed")

    # Use UUID to prevent overwriting
    filename = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    try:
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to save file: {e}")

    return {
        "message": "File uploaded successfully",
        "filename": filename,
        "saved_at": file_path
    }
