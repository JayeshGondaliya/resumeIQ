import os
import json
from openai import OpenAI
from dotenv import load_dotenv
from pathlib import Path

# load env file
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)


class OpenRouterError(Exception):
    pass


print("Loaded Key:", os.getenv("AI_API_KEY"))


def extract_resume_json_with_openrouter(resume_text: str) -> dict:
    api_key = os.getenv("AI_API_KEY")

    if not api_key:
        raise OpenRouterError("OPENROUTER_API_KEY not set")

    # OpenRouter Client (OpenAI Compatible)
    client = OpenAI(
        api_key=api_key,
        base_url="https://openrouter.ai/api/v1"
    )

    # ✅ Universal Resume Schema (General)
    schema = {
        "personal_info": {
            "name": None,
            "email": [],
            "phone": [],
            "location": None,
            "linkedin": None,
            "github": None,
            "portfolio": None
        },
        "summary": None,

        "education": [
            {
                "institution": None,
                "degree": None,
                "field_of_study": None,
                "start_year": None,
                "end_year": None,
                "gpa": None
            }
        ],

        "skills": {
            "technical": [],
            "frameworks": [],
            "tools": [],
            "soft_skills": [],
            "other": []
        },

        "languages": [],

        "experience": [
            {
                "company": None,
                "job_title": None,
                "employment_type": None,
                "location": None,
                "start_date": None,
                "end_date": None,
                "responsibilities": [],
                "technologies": [],
                "achievements": []
            }
        ],

        "projects": [
            {
                "title": None,
                "role": None,
                "technologies": [],
                "description": None,
                "github_link": None,
                "live_demo": None
            }
        ],

        "certifications": [],
        "achievements": [],
        "volunteer_experience": [],
        "courses": [],
        "interests": []
    }

    prompt = f"""
You are an ATS Resume Parser.

Extract resume information into this EXACT JSON structure.

RULES:
- Output ONLY valid JSON
- No markdown
- No explanation
- No extra text
- If missing, use null or empty list

JSON FORMAT:
{json.dumps(schema)}

RESUME TEXT:
{resume_text}
"""

    try:
        response = client.chat.completions.create(
            model="nvidia/nemotron-3-nano-30b-a3b:free",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a resume parser. "
                        "You must return ONLY valid JSON, nothing else."
                    )
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0
        )

        raw_text = response.choices[0].message.content.strip()

        # ✅ Clean JSON if model adds extra spaces/text
        raw_text = raw_text.strip("```").strip()

        return json.loads(raw_text)

    except json.JSONDecodeError as e:
        raise OpenRouterError(
            f"Invalid JSON returned.\nRaw Output:\n{raw_text}\nError: {e}"
        )

    except Exception as e:
        raise OpenRouterError(f"OpenRouter API Error: {e}")
