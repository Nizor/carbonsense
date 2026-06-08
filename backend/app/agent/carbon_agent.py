from .methodology import recommend_methodology
from .risks import detect_risks
from .scoring import calculate_score
from .llm_reasoner import (
    generate_assessment_reasoning
)


def classify_project(description: str):
    text = description.lower()

    if "agroforestry" in text:
        return "Agroforestry"

    if "reforestation" in text:
        return "Reforestation"

    if "afforestation" in text:
        return "Afforestation"

    return "Land Restoration"


def assess_project(description: str):
    project_type = classify_project(description)

    methodology = recommend_methodology(description)

    readiness_score = calculate_score(description)

    risks = detect_risks(description)

    analysis = generate_assessment_reasoning(
        description=description,
        project_type=project_type,
        methodology=methodology["methodology"],
        readiness_score=readiness_score,
        risks=risks
    )

    return {
        "project_type": project_type,
        "methodology": methodology["methodology"],
        "confidence": methodology["confidence"],
        "readiness_score": readiness_score,
        "risks": risks,
        "analysis": analysis
    }