import fasttext
import os

# Point this to where you downloaded the .ftz file
MODEL_PATH = "core/lid.176.ftz"

# We load this globally so it doesn't read from the hard drive on every request
if os.path.exists(MODEL_PATH):
    lang_model = fasttext.load_model(MODEL_PATH)
else:
    lang_model = None
    print("Warning: FastText model not found in core/")

def detect_language(text: str):
    if not lang_model:
        return "unknown"
    
    # FastText gets confused by newlines, so we flatten the string
    clean_text = text.replace("\n", " ")
    
    # Predict the top 1 language
    predictions = lang_model.predict(clean_text, k=1)
    
    # FastText returns labels like '__label__mr'. We strip it to just get 'mr'
    lang_code = predictions[0][0].replace("__label__", "")
    
    return lang_code