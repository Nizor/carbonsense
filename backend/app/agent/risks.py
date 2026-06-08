def detect_risks(description: str):
    risks = []

    text = description.lower()

    if "gps" not in text:
        risks.append("Missing GPS boundary data")

    if "monitoring" not in text:
        risks.append("Monitoring plan absent")

    if "baseline" not in text:
        risks.append("No baseline environmental data")

    if "ownership" not in text:
        risks.append("Land ownership evidence unclear")

    return risks