import os
import logging
from dotenv import load_dotenv

load_dotenv()

from app.agent.email_agent import EmailAgent, RankedArticleDetail, EmailDigestResponse
from app.agent.curator_agent import CuratorAgent
from app.profiles.user_profile import USER_PROFILE
from app.database.repository import Repository
from app.services.email import send_email, digest_to_html

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)


def print_beautiful_digest_to_console(digest: EmailDigestResponse):
    # ANSI escape characters for styling in console
    BOLD = "\033[1m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    CYAN = "\033[96m"
    BLUE = "\033[94m"
    RESET = "\033[0m"
    
    print("\n" + "=" * 80)
    print(f" {BOLD}{YELLOW}*** PERSONALIZED DAILY AI NEWS DIGEST ***{RESET} ")
    print("=" * 80)
    
    # Print Greeting & Intro
    print(f"\n{BOLD}{digest.introduction.greeting}{RESET}")
    print(f"\n{digest.introduction.introduction}")
    print("\n" + "-" * 80)
    
    # Print Articles
    for article in digest.articles:
        type_str = article.article_type.upper()
        print(f"\n{BOLD}{YELLOW}[Rank {article.rank}]{RESET} {BOLD}{GREEN}{article.title}{RESET} (Score: {article.relevance_score}/10)")
        print(f"{CYAN}Source: {type_str} | URL: {article.url}{RESET}")
        print(f"\n{article.summary}")
        if article.reasoning:
            print(f"\n{BOLD}{BLUE}Why this matches your profile:{RESET} {article.reasoning}")
        print("\n" + "-" * 80)
    
    print(f"\n{BOLD}{YELLOW}End of Digest (Top {len(digest.articles)} of {digest.total_ranked} articles ranked){RESET}")
    print("=" * 80 + "\n")


def generate_email_digest(hours: int = 24, top_n: int = 10) -> EmailDigestResponse:
    curator = CuratorAgent(USER_PROFILE)
    email_agent = EmailAgent(USER_PROFILE)
    repo = Repository()
    
    digests = repo.get_recent_digests(hours=hours)
    total = len(digests)
    
    if total == 0:
        logger.warning(f"No digests found from the last {hours} hours")
        raise ValueError("No digests available")
    
    logger.info(f"Ranking {total} digests for email generation")
    ranked_articles = curator.rank_digests(digests)
    
    if not ranked_articles:
        logger.error("Failed to rank digests")
        raise ValueError("Failed to rank articles")
    
    logger.info(f"Generating email digest with top {top_n} articles")
    
    article_details = [
        RankedArticleDetail(
            digest_id=a.digest_id,
            rank=a.rank,
            relevance_score=a.relevance_score,
            reasoning=a.reasoning,
            title=next((d["title"] for d in digests if d["id"] == a.digest_id), ""),
            summary=next((d["summary"] for d in digests if d["id"] == a.digest_id), ""),
            url=next((d["url"] for d in digests if d["id"] == a.digest_id), ""),
            article_type=next((d["article_type"] for d in digests if d["id"] == a.digest_id), "")
        )
        for a in ranked_articles
    ]
    
    email_digest = email_agent.create_email_digest_response(
        ranked_articles=article_details,
        total_ranked=len(ranked_articles),
        limit=top_n
    )
    
    logger.info("Email digest generated successfully")
    return email_digest


def send_digest_email(hours: int = 24, top_n: int = 10) -> dict:
    try:
        result = generate_email_digest(hours=hours, top_n=top_n)
        
        # Always output the beautiful digest to the console
        print_beautiful_digest_to_console(result)
        
        subject = f"Daily AI News Digest - {result.introduction.greeting.split('for ')[-1] if 'for ' in result.introduction.greeting else 'Today'}"
        
        send_email_env = os.getenv("SEND_EMAIL", "false").lower() == "true"
        if send_email_env:
            try:
                markdown_content = result.to_markdown()
                html_content = digest_to_html(result)
                
                send_email(
                    subject=subject,
                    body_text=markdown_content,
                    body_html=html_content
                )
                
                logger.info("Email sent successfully!")
                return {
                    "success": True,
                    "email_sent": True,
                    "subject": subject,
                    "articles_count": len(result.articles)
                }
            except Exception as e:
                logger.warning(f"Email sending failed, but digest was successfully generated on console: {e}")
                return {
                    "success": True,
                    "email_sent": False,
                    "subject": subject,
                    "articles_count": len(result.articles),
                    "error": str(e)
                }
        else:
            logger.info("Email sending is disabled (SEND_EMAIL=false). Digest displayed on console.")
            return {
                "success": True,
                "email_sent": False,
                "subject": subject,
                "articles_count": len(result.articles)
            }
    except ValueError as e:
        logger.error(f"Error sending email: {e}")
        return {
            "success": False,
            "error": str(e)
        }


if __name__ == "__main__":
    result = send_digest_email(hours=24, top_n=10)
    if result["success"]:
        print("\n=== Email Digest Sent ===")
        print(f"Subject: {result['subject']}")
        print(f"Articles: {result['articles_count']}")
    else:
        print(f"Error: {result['error']}")

