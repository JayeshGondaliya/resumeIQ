from generate_roadmap import generate_roadmap_using_openrouter
from dotenv import load_dotenv
load_dotenv()
# ✅ Set your API Key (temporary testing)


def test_sample():

    role = "Full Stack Developer"
    ats_score = 62.5
    missing_skills = ["React", "System Design", "Docker", "CI/CD"]
    current_level = "Intermediate"

    print("\n🚀 Testing Roadmap Generator...\n")

    roadmap = generate_roadmap_using_openrouter(
        role=role,
        ats_score=ats_score,
        missing_skills=missing_skills,
        current_level=current_level
    )

    print("\n✅ Roadmap JSON Output:\n")
    print(roadmap)


if __name__ == "__main__":
    test_sample()
