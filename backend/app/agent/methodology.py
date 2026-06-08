def recommend_methodology(description: str):
    text = description.lower()

    if "agroforestry" in text:
        return {
            "methodology": "VM0047",
            "confidence": 85
        }

    elif "reforestation" in text:
        return {
            "methodology": "VM0015",
            "confidence": 80
        }

    elif "forest" in text or "tree" in text:
        return {
            "methodology": "VM0007",
            "confidence": 75
        }

    return {
        "methodology": "VM0015",
        "confidence": 60
    }