import os
import json
from openai import OpenAI
from typing import List, Dict

class OpenRouterError(Exception):
    pass


def generate_roadmap_using_openrouter(role, ats_score, missing_skills, current_level):

    api_key = os.getenv("AI_API_KEY")
    if not api_key:
        raise OpenRouterError("AI_API_KEY not set")

    client = OpenAI(
        api_key=api_key,
        base_url="https://openrouter.ai/api/v1"
    )

    schema = {
        "total_duration": "X Weeks",
        "roadmap_overview": "short explanation",
        "weekly_plan": [
            {
                "week": 1,
                "focus": "Focus title",
                "learning": ["point 1", "point 2"],
                "practice": ["point 1", "point 2"],
                "deliverables": ["point 1"]
            }
        ],
        "projects_or_case_studies": [
            {
                "title": "Project Name",
                "description": "What to build or analyze",
                "skills_covered": ["skill1", "skill2"]
            }
        ],
        "interview_preparation": {
            "technical_or_domain": ["topic 1", "topic 2"],
            "behavioral": ["question 1", "question 2"]
        },
        "resume_optimization": ["improvement 1"],
        "common_mistakes_to_avoid": ["mistake 1"],
        "job_application_strategy": ["strategy 1"]
    }

    prompt = f"""
You are a senior career mentor.

Create a detailed career roadmap.

Candidate Profile:
- Target Role: {role}
- Current Level: {current_level}
- ATS Score: {ats_score}
- Missing Skills: {", ".join(missing_skills)}

Return ONLY valid JSON in this format:
{json.dumps(schema)}
"""

    try:
        response = client.chat.completions.create(
            model="nvidia/nemotron-3-nano-30b-a3b:free",
            messages=[
                {"role": "system", "content": "Return ONLY valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0,
            response_format={"type": "json_object"}
        )

        return json.loads(response.choices[0].message.content)

    except Exception as e:
        raise OpenRouterError(f"Roadmap API Error: {e}")
