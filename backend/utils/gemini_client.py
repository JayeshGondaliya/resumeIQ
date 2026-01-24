import os
import json
from google import genai


class GeminiError(Exception):
    pass


def extract_resume_json_with_gemini(resume_text: str) -> dict:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise GeminiError("GEMINI_API_KEY not set")

    client = genai.Client(api_key=api_key)

    prompt = f"""
You are an ATS resume parser.

You will be given resume text.
Your task is to extract structured data and return ONLY valid JSON.

RULES (STRICT):
- Output ONLY valid JSON
- Do NOT include markdown
- Do NOT include explanations
- Do NOT hallucinate missing data
- If a field is missing, return null or empty list

JSON SCHEMA (MUST FOLLOW EXACTLY):

{{
  "personal_info": {{
    "name": null,
    "email": null,
    "phone": null,
    "location": null
  }},
  "summary": null,
  "education": [
    {{
      "institution": null,
      "degree": null,
      "duration": null,
      "gpa": null
    }}
  ],
  "skills": [],
  "languages": [],
  "projects": [
    {{
      "title": null,
      "role": null,
      "technologies": [],
      "description": null
    }}
  ]
}}

RESUME TEXT:
{resume_text}
"""

    response = client.models.generate_content(
        model="models/gemini-flash-latest",
        contents=prompt
    )

    if not response or not response.text:
        raise GeminiError("Empty response from Gemini")

    try:
        return json.loads(response.text)
    except json.JSONDecodeError as e:
        raise GeminiError(f"Invalid JSON returned by Gemini: {e}")
