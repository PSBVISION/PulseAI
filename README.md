# Pulse-AI: Daily AI News Aggregator & Curator

Pulse-AI is an automated news aggregator and curation platform designed for AI engineers and researchers. It scrapes AI updates from multiple authoritative sources (YouTube, Anthropic, OpenAI, Google Gemini, and DeepSeek/Chinese AI news), generates structured summaries using **Gemini 1.5 Flash**, ranks them based on a personalized user profile, and sends a curated newsletter directly to your inbox.

---

## 🛠️ Tech Stack & Key Libraries

* **Language:** Python (>= 3.14)
* **Database:** PostgreSQL (v17 running on Docker) & SQLAlchemy ORM
* **AI Agents:** Google Generative AI (`google-genai` client SDK) running **Gemini 1.5 Flash**
* **Document Parsing:** `docling` (for high-fidelity web page parsing to markdown)
* **Scraping & Feeds:** `feedparser` (RSS reader) & `beautifulsoup4`
* **Transcripts:** `youtube-transcript-api`
* **Package Management:** `uv` (modern Python package resolver and runner)

---

## 📂 Project Structure

```
pulse-ai/
├── main.py                     # Primary pipeline entry point
├── pyproject.toml              # Project dependencies & configurations
├── docker/
│   └── docker-compose.yml      # Local PostgreSQL container definition
└── app/
    ├── example.env             # Template environment variables configuration
    ├── config.py               # YouTube channels config
    ├── daily_runner.py         # End-to-end orchestration pipeline
    ├── runner.py               # Aggregated scraping execution
    ├── database/
    │   ├── connection.py       # SQLAlchemy engine & session factory
    │   ├── create_tables.py    # Database migrations init script
    │   ├── models.py           # SQLAlchemy tables (YouTube, scrapers, digests)
    │   └── repository.py       # SQL database operations (CRUD & bulk queries)
    ├── scrapers/
    │   ├── anthropic.py        # Anthropic news feed scraper
    │   ├── deepseek.py         # Pandaily & TechNode Chinese AI/DeepSeek scraper
    │   ├── gemini.py           # Official Google AI feed scraper
    │   ├── openai.py           # OpenAI news feed scraper
    │   └── youtube.py          # YouTube channel videos & transcript parser
    ├── agent/
    │   ├── curator_agent.py    # Gemini-based personalized ranking agent
    │   ├── digest_agent.py     # Gemini-based technical summarization agent
    │   └── email_agent.py      # Gemini-based personalized newsletter intro agent
    ├── profiles/
    │   └── user_profile.py     # Technical user interests & ranking criteria
    └── services/
        ├── email.py            # SMTP configuration & email HTML formatting
        ├── process_anthropic.py # Web scraping to markdown converter service
        ├── process_curator.py  # Article curation engine service
        ├── process_digest.py   # Article summarizer service
        ├── process_email.py    # Email compiler and sender service
        └── process_youtube.py  # YouTube transcript downloader service
```

---

## 🚀 Getting Started

### 1. Prerequisite Tools
Ensure you have the following installed:
* [Docker Desktop](https://www.docker.com/)
* [uv](https://github.com/astral-sh/uv) (Python package manager)

### 2. Environment Setup
Copy the template configuration into a new `.env` file at the root of the workspace:
```powershell
cp app/example.env .env
```
Open `.env` and fill in the values:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
MY_EMAIL=your_sender_smtp_email@gmail.com
APP_PASSWORD=your_gmail_app_password_here
```

### 3. Spin Up the Database
Run the PostgreSQL service inside a background Docker container:
```powershell
docker compose -f docker/docker-compose.yml up -d
```

### 4. Create Database Tables
Initialize the schema inside your local PostgreSQL database:
```powershell
uv run python app/database/create_tables.py
```

### 5. Run the Aggregator Pipeline
Execute the pipeline end-to-end to scrape new articles, summarize, curate, and send the digest email:
```powershell
uv run python main.py
```

---

## 🔍 In-Depth Architecture

For a comprehensive deep dive into the architecture, data flows, database schemas, and AI agent prompt mechanics, please check out [architecture.md](file:///c:/Users/punit/Desktop/myProjects/terafac-hackathon/architecture.md).
