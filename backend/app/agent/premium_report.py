from openai import OpenAI
from app.config import (
    OPENAI_API_KEY,
    MODEL
)

client = OpenAI(api_key=OPENAI_API_KEY)


def generate_premium_report(description: str):

    prompt = f"""
You are a carbon MRV verification expert.

Analyze this project:

{description}

Generate a professional PREMIUM MRV report.

Include:

1. Executive Summary

2. Recommended Carbon Methodology
(Choose from VM0015, VM0007, VM0047)

3. Compliance Gap Analysis

4. Recommended Monitoring Plan
- Drone frequency
- Satellite monitoring
- Field verification

5. Estimated Carbon Credit Potential
(provide a reasonable range)

6. Risks and Mitigation

7. Recommended Next Steps

Format professionally.
"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": "You are a senior carbon MRV consultant."
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content