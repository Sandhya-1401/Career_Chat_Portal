import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
print("✅ Key loaded from .env?" , bool(api_key))

if api_key:
    genai.configure(api_key=api_key)
    print("▶ Available models:")
    try:
        for model in genai.list_models():
            print("   •", model.name)
    except Exception as e:
        print("❌ ERROR:", e)
else:
    print("🚫 API key not found in environment.")
