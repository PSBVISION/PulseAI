#!/usr/bin/env python
"""Quick test to verify Gemini API is working"""

import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("ERROR: GEMINI_API_KEY not set in .env")
    exit(1)

genai.configure(api_key=api_key)

# List available models
try:
    print("Available models:")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"  - {m.name}")
except Exception as e:
    print(f"Could not list models: {e}")

# Try with gemini-2.5-flash (latest available)
models_to_try = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-pro-latest"]
for model_name in models_to_try:
    try:
        print(f"\nTesting {model_name}...")
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("What is 2+2?", safety_settings=[])
        print(f"✓ SUCCESS with {model_name}: {response.text[:50]}")
        break
    except Exception as e:
        print(f"✗ {model_name}: {str(e)[:60]}")
    
print("\nDone!")
