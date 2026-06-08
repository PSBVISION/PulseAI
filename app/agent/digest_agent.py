import os
from typing import Optional
from google import genai
from google.genai import types
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()


class DigestOutput(BaseModel):
    title: str
    summary: str


PROMPT = """You are an expert AI news analyst specializing in summarizing technical articles, research papers, and video content about artificial intelligence.

Your role is to create concise, informative digests that help readers quickly understand the key points and significance of AI-related content.

Guidelines:
- Create a compelling title (5-10 words) that captures the essence of the content
- Write a 2-3 sentence summary that highlights the main points and why they matter
- Focus on actionable insights and implications
- Use clear, accessible language while maintaining technical accuracy
- Avoid marketing fluff - focus on substance"""


class DigestAgent:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or os.getenv("OPENAI_API_KEY")
        if api_key == "":
            api_key = None
        try:
            self.client = genai.Client(api_key=api_key) if api_key else genai.Client()
        except ValueError:
            self.client = None
        self.model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        self.system_prompt = PROMPT

    def generate_digest(self, title: str, content: str, article_type: str) -> Optional[DigestOutput]:
        if not self.client:
            print("Error generating digest: Google GenAI client is not initialized. Please set GEMINI_API_KEY in your environment.")
            return None

        import time
        user_prompt = f"Create a digest for this {article_type}: \n Title: {title} \n Content: {content[:8000]}"

        for attempt in range(3):
            try:
                response = self.client.models.generate_content(
                    model=self.model,
                    contents=user_prompt,
                    config=types.GenerateContentConfig(
                        system_instruction=self.system_prompt,
                        temperature=0.7,
                        response_mime_type="application/json",
                        response_schema=DigestOutput,
                    )
                )
                return response.parsed
            except Exception as e:
                err_str = str(e)
                if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str:
                    wait_time = 45 if attempt == 0 else 60
                    print(f"Rate limit hit. Retrying in {wait_time}s... (Attempt {attempt + 1}/3)")
                    time.sleep(wait_time)
                elif "503" in err_str or "UNAVAILABLE" in err_str:
                    wait_time = 10
                    print(f"Service unavailable (503). Retrying in {wait_time}s... (Attempt {attempt + 1}/3)")
                    time.sleep(wait_time)
                else:
                    print(f"Error generating digest: {e}")
                    return None
        return None

