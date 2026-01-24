# ============================================================================
# MAIN ATS SCORING FUNCTION
# ============================================================================

def calculate_ats_score(resume: dict, job: dict) -> dict:
    score = 0
    max_score = 100
    breakdown = {}

    # --------------------------------
    # 1. COLLECT ALL RESUME DATA
    # --------------------------------
    resume_skills = {normalize_text(s) for s in resume.get("skills", [])}

    project_skills = set()
    project_descriptions = []

    for project in resume.get("projects", []):
        for tech in project.get("technologies", []):
            project_skills.add(normalize_text(tech))

        desc = f"{project.get('title', '')} {project.get('role', '')} {project.get('description', '')}"
        project_descriptions.append(normalize_text(desc))

    summary_keywords = extract_keywords(resume.get("summary", ""))

    all_resume_keywords = resume_skills | project_skills | summary_keywords

    # --------------------------------
    # 2. REQUIRED SKILLS MATCHING (50)
    # --------------------------------
    required = job.get("required_skills", [])
    matched_required = []

    for req in required:
        if is_skill_match(req, all_resume_keywords, project_descriptions):
            matched_required.append(req)

    required_score = (len(matched_required) / len(required)) * 50 if required else 0
    score += required_score

    breakdown["required_skills"] = {
        "matched": matched_required,
        "missing": list(set(required) - set(matched_required)),
        "score": round(required_score, 2)
    }

    # --------------------------------
    # 3. OPTIONAL SKILLS MATCHING (20)
    # --------------------------------
    optional = job.get("optional_skills", [])
    matched_optional = []

    for opt in optional:
        if is_skill_match(opt, all_resume_keywords, project_descriptions):
            matched_optional.append(opt)

    optional_score = (len(matched_optional) / len(optional)) * 20 if optional else 0
    score += optional_score

    breakdown["optional_skills"] = {
        "matched": matched_optional,
        "score": round(optional_score, 2)
    }

    # --------------------------------
    # 4. EDUCATION MATCHING (15)
    # --------------------------------
    edu_score = 0
    education = resume.get("education", [])

    if education:
        try:
            gpa_value = normalize_gpa(education[0].get("gpa"))
            min_gpa = job.get("minimum_gpa", 0)

            # ATS-style threshold logic
            if gpa_value >= min_gpa:
                edu_score = 15
        except:
            edu_score = 10

    score += edu_score
    breakdown["education"] = {
        "gpa": education[0].get("gpa") if education else None,
        "score": round(edu_score, 2)
    }

    # --------------------------------
    # 5. ROLE MATCHING (15)
    # --------------------------------
    role_score = calculate_role_match(
        job.get("preferred_roles", []),
        resume,
        project_descriptions
    )

    score += role_score
    breakdown["role_match"] = {
        "matched": role_score > 0,
        "score": round(role_score, 2)
    }

    # --------------------------------
    # 6. EXPERIENCE BONUS (5)
    # --------------------------------
    exp_bonus = calculate_experience_bonus(resume, job)
    score += exp_bonus

    breakdown["experience_bonus"] = {
        "score": round(exp_bonus, 2)
    }

    score = min(score, max_score)

    return {
        "final_score": round(score, 2),
        "out_of": max_score,
        "breakdown": breakdown
    }


# ============================================================================
# HELPER FUNCTIONS (ALL INCLUDED — NOTHING MISSING)
# ============================================================================

def normalize_text(text: str) -> str:
    if not text:
        return ""
    text = text.lower()
    text = ''.join(c if c.isalnum() or c in ['/', ' ', '-', '.', '#', '+'] else ' ' for c in text)
    return ' '.join(text.split())


def extract_keywords(text: str) -> set:
    if not text:
        return set()

    stop_words = {
        'a','an','the','and','or','but','in','on','at','to','for','of','with',
        'by','as','is','was','were','be','been','being','have','has','had',
        'do','does','did','will','would','should','could','can','may','might',
        'very','just','also','than','that','this','these','those','from'
    }

    words = normalize_text(text).split()
    return {w for w in words if len(w) > 1 and w not in stop_words}


def is_skill_match(job_skill: str, resume_keywords: set, project_descriptions: list) -> bool:
    job_keywords = extract_keywords(job_skill)

    GENERIC = {'programming','development','framework','language','design','principles'}

    core_keywords = [k for k in job_keywords if k not in GENERIC]

    # Direct core keyword match
    if any(k in resume_keywords for k in core_keywords):
        return True

    # Context match in project descriptions
    for desc in project_descriptions:
        if any(k in desc for k in core_keywords):
            return True

    # Synonyms
    synonyms = {
        'git': 'version control',
        'async': 'asynchronous',
        'await': 'asynchronous',
        'flutter': 'dart',
        'android': 'java',
        'asp.net': 'aspnet',
        '.net': 'dotnet'
    }

    for k in core_keywords:
        if k in synonyms and synonyms[k] in resume_keywords:
            return True

    return False


def normalize_gpa(gpa_str: str) -> float:
    try:
        clean = ''.join(c for c in str(gpa_str) if c.isdigit() or c == '.')
        gpa = float(clean)

        if gpa <= 4.0:
            return gpa
        elif gpa <= 10.0:
            return (gpa / 10.0) * 4.0
        elif gpa <= 100:
            return (gpa / 100.0) * 4.0
        return 0.0
    except:
        return 0.0


def calculate_role_match(roles: list, resume: dict, project_descriptions: list) -> float:
    if not roles:
        return 0.0

    summary = normalize_text(resume.get("summary", ""))
    scores = []

    role_keywords = {
        'developer': ['developer','programmer','software'],
        'engineer': ['engineer'],
        'frontend': ['frontend','ui','ux'],
        'backend': ['backend','server','api'],
        'mobile': ['mobile','android','flutter'],
        'fullstack': ['fullstack','full-stack']
    }

    for role in roles:
        role_norm = normalize_text(role)
        role_score = 0

        if role_norm in summary:
            role_score += 4

        for desc in project_descriptions:
            if role_norm in desc:
                role_score += 4

        for cat, keys in role_keywords.items():
            if cat in role_norm:
                for k in keys:
                    if k in summary:
                        role_score += 2

        scores.append(min(role_score, 10))

    return (max(scores) / 10) * 15


def calculate_experience_bonus(resume: dict, job: dict) -> float:
    bonus = 0
    projects = resume.get("projects", [])
    required = {normalize_text(r) for r in job.get("required_skills", [])}

    relevant = 0
    for p in projects:
        techs = {normalize_text(t) for t in p.get("technologies", [])}
        if required & techs:
            relevant += 1

    if relevant >= 2:
        bonus += 2
    if relevant >= 4:
        bonus += 1

    if resume.get("summary"):
        bonus += 1

    return min(bonus, 5)
