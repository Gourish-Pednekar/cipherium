from transformers import pipeline

classifier = pipeline(
    "zero-shot-classification",
    model="MoritzLaurer/mDeBERTa-v3-base-mnli-xnli",
    device=-1  # CPU
)

CANDIDATE_LABELS = [
    "phishing scam",
    "banking fraud",
    "normal conversation",
    "customer support"
]

def analyze_intent(text: str) -> float:
    result = classifier(text, CANDIDATE_LABELS)

    scam_scores = [
        score
        for label, score in zip(result["labels"], result["scores"])
        if label in ("phishing scam", "banking fraud")
    ]

    return max(scam_scores) if scam_scores else 0.0