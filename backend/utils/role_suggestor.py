import re
from collections import defaultdict

# ======================================================
# MAIN FUNCTION
# ======================================================

def suggest_top_roles(resume: dict, ats_score: dict, top_n: int = 3) -> dict:
    """
    Universal role suggestion engine.
    Returns top N best-fit roles.
    Works for ANY resume (technical / non-technical).
    """

    final_ats = ats_score.get("final_score", 0)

    role_scores = defaultdict(int)
    role_sources = defaultdict(set)

    # --------------------------------------------------
    # 1. EXPERIENCE / PROJECT ROLES (STRONG SIGNAL)
    # --------------------------------------------------
    for section in ["experience", "projects"]:
        for item in resume.get(section, []):
            role = item.get("role") or item.get("title")
            if role:
                role = normalize_role(role)
                role_scores[role] += 5
                role_sources[role].add(section)

    # --------------------------------------------------
    # 2. SUMMARY ROLE EXTRACTION
    # --------------------------------------------------
    summary = resume.get("summary", "")
    extracted_roles = extract_roles_from_text(summary)

    for role in extracted_roles:
        role_scores[role] += 3
        role_sources[role].add("summary")

    # --------------------------------------------------
    # 3. SKILL-BASED ROLE INFERENCE (GENERIC)
    # --------------------------------------------------
    skills_text = " ".join(resume.get("skills", [])).lower()
    inferred_roles = infer_roles_from_skills(skills_text)

    for role in inferred_roles:
        role_scores[role] += 2
        role_sources[role].add("skills")

    # --------------------------------------------------
    # 4. FALLBACK
    # --------------------------------------------------
    if not role_scores:
        return {
            "top_roles": [{
                "role": "General Professional",
                "confidence": "Low",
                "score": 0,
                "signals": [],
            }],
            "roadmap_allowed": final_ats >= 60
        }

    # --------------------------------------------------
    # 5. SORT & PICK TOP N
    # --------------------------------------------------
    sorted_roles = sorted(
        role_scores.items(),
        key=lambda x: x[1],
        reverse=True
    )[:top_n]

    # --------------------------------------------------
    # 6. BUILD RESPONSE
    # --------------------------------------------------
    top_roles = []

    for role, score in sorted_roles:
        if score >= 8 and final_ats >= 75:
            confidence = "High"
        elif score >= 5:
            confidence = "Medium"
        else:
            confidence = "Low"

        top_roles.append({
            "role": role,
            "confidence": confidence,
            "score": score,
            "signals": list(role_sources[role])
        })

    return {
        "top_roles": top_roles,
        "roadmap_allowed": final_ats >= 60
    }


# ======================================================
# HELPERS
# ======================================================

def normalize_role(role: str) -> str:
    role = role.lower()
    role = re.sub(r'[^a-z\s]', '', role)
    role = re.sub(r'\s+', ' ', role).strip()
    return role.title()


def extract_roles_from_text(text: str) -> set:
    role_indicators = [
        "engineer", "developer", "designer", "analyst", "manager",
        "consultant", "coordinator", "executive", "specialist",
        "officer", "administrator", "assistant", "lead", "intern"
    ]

    roles = set()
    words = text.lower().split()

    for i in range(len(words) - 1):
        phrase = f"{words[i]} {words[i + 1]}"
        for indicator in role_indicators:
            if indicator in phrase:
                roles.add(normalize_role(phrase))

    return roles


def infer_roles_from_skills(skill_text: str) -> set:
    domain_map = {
        "Software": ["programming", "development", "coding", "software"],
        "Marketing": ["seo", "content", "branding", "campaign", "marketing"],
        "Human Resources": ["recruitment", "hr", "onboarding", "payroll"],
        "Finance": ["accounting", "finance", "audit", "tax", "budget"],
        "Sales": ["sales", "crm", "lead", "pipeline", "negotiation"],
        "Operations": ["operations", "process", "logistics", "supply"],
        "Data": ["data", "analytics", "analysis", "visualization"],
        "Design": ["design", "ux", "ui", "creative"],
        "Management": ["management", "strategy", "leadership", "planning"],
        "Education": ["teaching", "training", "curriculum", "education"],
        "Healthcare": ["clinical", "healthcare", "medical", "patient"]
    }

    inferred = set()

    for domain, keywords in domain_map.items():
        for kw in keywords:
            if kw in skill_text:
                inferred.add(f"{domain} Professional")
                break

    return inferred
