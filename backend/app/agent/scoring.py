def calculate_score(description: str):
    score = 40

    text = description.lower()

    keywords = [
        "gps",
        "monitoring",
        "baseline",
        "ownership",
        "drone",
        "satellite",
        "soil"
    ]

    for keyword in keywords:
        if keyword in text:
            score += 8

    return min(score, 100)