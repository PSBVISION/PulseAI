# Pulse-AI: Deep-Dive Architecture Guide

This guide describes the core subsystems, pipeline phases, database schema design, and generative AI configurations of the **Pulse-AI** platform.

---

## 🏛️ System Architecture Overview

The application is built around a five-stage pipeline orchestrated by the **Daily Runner**:

```mermaid
graph TD
    A[Scraping Phase] --> B[Processing Phase]
    B --> C[Digest Generation Phase]
    C --> D[Curation Phase]
    D --> E[Email Compiler & Delivery]
    
    subgraph Scraping Sources
        S1[YouTube Channels]
        S2[OpenAI RSS]
        S3[Anthropic RSS]
        S4[Google Gemini RSS]
        S5[DeepSeek / Chinese AI RSS]
    end
    
    subgraph SQL Database
        DB[(PostgreSQL)]
    end
    
    subgraph AI Agents
        Agent1[DigestAgent]
        Agent2[CuratorAgent]
        Agent3[EmailAgent]
    end
    
    Scraping Sources --> A
    A -->|Raw Articles| DB
    B -->|Transcripts & Markdown| DB
    DB --> C
    C -->|Generate Digest| Agent1
    Agent1 -->|Save Summary| DB
    DB --> D
    D -->|Rank digests| Agent2
    E -->|Write intro & send| Agent3
```

---

## 🔄 Pipeline Execution Phases

### Phase 1: Scraping Phase
The aggregator pulls raw updates published over a defined timeframe (default: last 24 hours):
* **YouTube:** Uses `feedparser` to read video uploads and `youtube-transcript-api` to pull transcripts.
* **RSS Feeds:**
  * **OpenAI:** Scrapes official OpenAI updates from `https://openai.com/news/rss.xml`.
  * **Anthropic:** Scrapes news, research, and engineering RSS feeds.
  * **Gemini (Google):** Scrapes official Google technology AI updates from `https://blog.google/technology/ai/rss/`.
  * **DeepSeek & Chinese AI:** Scrapes Pandaily and TechNode tech feeds, using a keyword-based filter (`deepseek`, `qwen`, `kimi`, `doubao`, `zhipu`, etc.) to isolate Chinese AI developments.

### Phase 2: Processing Phase
Transforms the scraped raw articles into standardized readable content:
* **Anthropic Articles:** Utilizes the `docling` package to download the full webpage content and translate it into high-fidelity markdown format.
* **YouTube Videos:** Downloads complete transcripts and updates the `youtube_videos` table.

### Phase 3: Digest Generation Phase (AI Agent)
Uses `DigestAgent` to analyze raw text and extract technical substance.
* **Agent:** `DigestAgent`
* **Model:** `gemini-1.5-flash`
* **Prompt Strategy:** Instructs the model to write a technical 2-3 sentence summary and generate a compelling 5-10 word title, ignoring marketing hype.
* **Structured Output:** The agent leverages the `google-genai` SDK schema enforcement (`response_schema=DigestOutput`) to parse the JSON directly into a Pydantic model containing:
  * `title`: Compelling short title.
  * `summary`: Concrete technical summary.

### Phase 4: Curation Phase (AI Agent)
The `CuratorAgent` ranks the accumulated digests according to a detailed profile in `app/profiles/user_profile.py`.
* **Agent:** `CuratorAgent`
* **Model:** `gemini-1.5-flash`
* **Curation Criteria:** The agent ranks posts on a `0.0` to `10.0` scale based on relevance to interests (e.g., LLMs, RAG, scaling infrastructure), technical depth, novelty, and actionability.
* **Structured Output:** Configures the client to parse the output directly into:
  * `articles`: A list of ranked items, each containing:
    * `digest_id`: Structured key mapping back to the article (e.g., `deepseek:url`).
    * `relevance_score`: Float ranking score.
    * `rank`: Unique integer representing absolute rank.
    * `reasoning`: Detailed explanation of the score.

### Phase 5: Email Compile & SMTP Delivery (AI Agent)
Consolidates the ranked digests into a newsletter.
* **Agent:** `EmailAgent`
* **Model:** `gemini-1.5-flash`
* **Prompt Strategy:** Generates a friendly, personalized greeting and a 2-3 sentence executive summary of the top-ranked articles.
* **SMTP Server:** Compiles the introduction and top-ranked digests into a mobile-friendly HTML format, sending it via SMTP secure connection.

---

## 🗄️ Database Schema Design

The system runs on PostgreSQL. The database schema consists of the following tables:

### 1. `youtube_videos`
Stores metadata and parsed transcripts for YouTube channels.
* `video_id` (Primary Key, String)
* `title` (String)
* `url` (String)
* `channel_id` (String)
* `published_at` (DateTime)
* `description` (Text)
* `transcript` (Text, Nullable)
* `created_at` (DateTime)

### 2. `openai_articles`
* `guid` (Primary Key, String)
* `title` (String)
* `url` (String)
* `description` (Text)
* `published_at` (DateTime)
* `category` (String, Nullable)
* `created_at` (DateTime)

### 3. `anthropic_articles`
* `guid` (Primary Key, String)
* `title` (String)
* `url` (String)
* `description` (Text)
* `published_at` (DateTime)
* `category` (String, Nullable)
* `markdown` (Text, Nullable) - Populated by the `docling` parser.
* `created_at` (DateTime)

### 4. `gemini_articles`
* `guid` (Primary Key, String)
* `title` (String)
* `url` (String)
* `description` (Text)
* `published_at` (DateTime)
* `category` (String, Nullable)
* `created_at` (DateTime)

### 5. `deepseek_articles`
* `guid` (Primary Key, String)
* `title` (String)
* `url` (String)
* `description` (Text)
* `published_at` (DateTime)
* `category` (String, Nullable)
* `created_at` (DateTime)

### 6. `digests`
Contains the AI-generated titles and summaries.
* `id` (Primary Key, String) - e.g. `youtube:vid123` or `deepseek:guid456`
* `article_type` (String) - `youtube`, `openai`, `anthropic`, `gemini`, or `deepseek`
* `article_id` (String)
* `url` (String)
* `title` (String) - AI generated
* `summary` (Text) - AI generated
* `created_at` (DateTime)

---

## 🛡️ Robust API Key Design

To support running the pipeline or test scrapers without crashing if API keys are not yet present, the agent initialization handles missing credentials gracefully:
```python
api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or os.getenv("OPENAI_API_KEY")
if api_key == "":
    api_key = None
try:
    # Attempt client initialization
    self.client = genai.Client(api_key=api_key) if api_key else genai.Client()
except ValueError:
    self.client = None
```
If the client cannot be initialized, the pipeline continues execution for database and scraper activities, logging an informative error only when attempting an active LLM generation.
