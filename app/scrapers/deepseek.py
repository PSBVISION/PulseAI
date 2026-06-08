from datetime import datetime, timedelta, timezone
from typing import List, Optional
import feedparser
from pydantic import BaseModel


class DeepSeekArticle(BaseModel):
    title: str
    description: str
    url: str
    guid: str
    published_at: datetime
    category: Optional[str] = None


class DeepSeekScraper:
    def __init__(self):
        # We can use multiple feeds or a specific Chinese AI tech feed.
        # Pandaily feed: https://pandaily.com/feed/
        # TechNode feed: https://technode.com/feed/
        self.rss_urls = [
            "https://pandaily.com/feed/",
            "https://technode.com/feed/"
        ]

    def get_articles(self, hours: int = 24) -> List[DeepSeekArticle]:
        now = datetime.now(timezone.utc)
        cutoff_time = now - timedelta(hours=hours)
        articles = []
        seen_guids = set()
        
        # Keywords to identify DeepSeek or Chinese AI news
        chinese_ai_keywords = [
            "deepseek", "qwen", "baidu", "tencent", "sensetime", "baichuan", 
            "zhipu", "moonshot", "minimax", "kimi", "doubao", "bytedance", 
            "huawei", "aliyun", "alibaba ai", "chinese ai", "china ai"
        ]
        
        for url in self.rss_urls:
            feed = feedparser.parse(url)
            if not feed.entries:
                continue
                
            for entry in feed.entries:
                published_parsed = getattr(entry, "published_parsed", None)
                if not published_parsed:
                    continue
                
                published_time = datetime(*published_parsed[:6], tzinfo=timezone.utc)
                if published_time >= cutoff_time:
                    title = entry.get("title", "")
                    description = entry.get("description", "")
                    content = (title + " " + description).lower()
                    
                    # Filter for DeepSeek or Chinese AI articles
                    is_chinese_ai = any(kw in content for kw in chinese_ai_keywords)
                    if is_chinese_ai:
                        guid = entry.get("id", entry.get("link", ""))
                        if guid not in seen_guids:
                            seen_guids.add(guid)
                            articles.append(DeepSeekArticle(
                                title=title,
                                description=description,
                                url=entry.get("link", ""),
                                guid=guid,
                                published_at=published_time,
                                category=entry.get("tags", [{}])[0].get("term") if entry.get("tags") else None
                            ))
        
        return articles


if __name__ == "__main__":
    scraper = DeepSeekScraper()
    articles: List[DeepSeekArticle] = scraper.get_articles(hours=100)
    print(f"Scraped {len(articles)} Chinese AI / DeepSeek articles.")
