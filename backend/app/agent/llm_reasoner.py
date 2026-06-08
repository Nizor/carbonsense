from openai import OpenAI
from app.config import OPENAI_API_KEY, MODEL

client = OpenAI(api_key=OPENAI_API_KEY)


def generate_assessment_reasoning(
    description: str,
    project_type: str,
    methodology: str,
    readiness_score: int,
    risks: list
):

    prompt = f"""
You are an expert carbon MRV analyst.

Analyze this carbon project.

PROJECT:
{description}

PROJECT TYPE:
{project_type}

RECOMMENDED METHODOLOGY:
{methodology}

READINESS SCORE:
{readiness_score}

RISKS:
{risks}

Generate a professional response with:

1. Executive Summary
2. Why the methodology fits
3. Readiness interpretation
4. Main risks explained
5. Recommended next steps

Keep it concise and professional.
"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": "You are a carbon MRV expert."
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content