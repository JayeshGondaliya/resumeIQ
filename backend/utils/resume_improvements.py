# ============================================================================
# GAP ANALYSIS & RESUME IMPROVEMENT ENGINE
# ============================================================================

def generate_resume_improvements(resume: dict, job: dict, ats_result: dict) -> dict:
    improvements = {
        "critical_missing_skills": [],
        "recommended_skill_additions": [],
        "project_improvements": [],
        "summary_improvements": [],
        "estimated_score_after_fix": None
    }

    breakdown = ats_result.get("breakdown", {})

    # --------------------------------
    # 1. CRITICAL REQUIRED SKILLS
    # --------------------------------
    missing_required = breakdown.get("required_skills", {}).get("missing", [])

    for skill in missing_required:
        improvements["critical_missing_skills"].append({
            "skill": skill,
            "importance": "High",
            "action": f"Add explicit mention of '{skill}' in skills section or project descriptions"
        })

    # --------------------------------
    # 2. OPTIONAL SKILLS (LOWER PRIORITY)
    # --------------------------------
    optional_skills = job.get("optional_skills", [])
    matched_optional = breakdown.get("optional_skills", {}).get("matched", [])

    for skill in optional_skills:
        if skill not in matched_optional:
            improvements["recommended_skill_additions"].append({
                "skill": skill,
                "importance": "Medium",
                "action": f"Add if you have hands-on exposure or coursework related to '{skill}'"
            })

    # --------------------------------
    # 3. PROJECT IMPROVEMENTS
    # --------------------------------
    project_text = " ".join(
        p.get("description", "").lower() for p in resume.get("projects", [])
    )

    for skill in missing_required:
        core = skill.lower().split()[0]
        if core not in project_text:
            improvements["project_improvements"].append({
                "issue": f"'{skill}' not demonstrated in projects",
                "suggestion": f"Update at least one project to show usage of {skill}"
            })

    # --------------------------------
    # 4. SUMMARY IMPROVEMENTS
    # --------------------------------
    summary = resume.get("summary", "").lower()

    for skill in missing_required[:3]:  # limit noise
        keyword = skill.lower().split()[0]
        if keyword not in summary:
            improvements["summary_improvements"].append(
                f"Explicitly mention '{skill}' in your professional summary"
            )

    # --------------------------------
    # 5. ESTIMATED SCORE IMPACT
    # --------------------------------
    current_score = ats_result.get("final_score", 0)

    # Conservative estimate: +4 points per required skill fixed
    estimated_gain = min(len(missing_required) * 4, 25)
    improvements["estimated_score_after_fix"] = min(
        100, round(current_score + estimated_gain, 2)
    )

    return improvements