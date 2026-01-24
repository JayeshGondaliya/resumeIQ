import os
import json
from google import genai


class GeminiError(Exception):
    pass


def extract_job_json_with_gemini(job_role: str) -> dict:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise GeminiError("GEMINI_API_KEY not set")

    client = genai.Client(api_key=api_key)

    prompt = f"""
You are an ATS system.

Given ONLY a job role, infer realistic hiring requirements.

RULES:
- Output STRICT JSON only
- No explanations
- No markdown
- No extra keys
- Skills must be industry-relevant
- Keep it general (not company-specific)

JSON FORMAT:
{{
  "required_skills": [],
  "optional_skills": [],
  "preferred_roles": [],
  "minimum_gpa": 0
}}

JOB ROLE:
{job_role}
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
