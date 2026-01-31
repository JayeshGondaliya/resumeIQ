import os
import json
from openai import OpenAI


class OpenRouterError(Exception):
    pass


def extract_job_json_with_openrouter(job_role: str) -> dict:
    api_key = os.getenv("AI_API_KEY")

    if not api_key:
        raise OpenRouterError("OPENROUTER_API_KEY not set")

    client = OpenAI(
        api_key=api_key,
        base_url="https://openrouter.ai/api/v1"
    )

    schema = {
        "required_skills": [],
        "optional_skills": [],
        "preferred_roles": [],
        "minimum_gpa": None
        }
    
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
{json.dumps(schema)}

JOB ROLE:
{job_role}
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
