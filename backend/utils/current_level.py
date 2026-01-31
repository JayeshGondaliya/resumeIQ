def detect_current_level(resume_json, ats_json):
    projects = resume_json.get("projects", [])
    experience = resume_json.get("experience", [])

    ats_score = ats_json["final_score"]

    # Rule 1: Working Professional
    if len(experience) > 0:
        return "Experienced Professional"

    # Rule 2: Fresher but strong projects
    if len(projects) >= 3 and ats_score >= 50:
        return "Entry-Level Developer (Strong Projects)"

    # Rule 3: Beginner
    if len(projects) <= 1:
        return "Beginner"

    # Default
    return "Entry-Level"