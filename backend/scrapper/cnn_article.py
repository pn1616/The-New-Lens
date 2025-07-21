import requests
from bs4 import BeautifulSoup
import json
import time

def get_cnn_article_text(url):
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")

    paragraphs = soup.find_all("p", attrs={"data-component-name": "paragraph"})

    full_text = "\n".join(p.get_text(strip=True) for p in paragraphs if p.get_text(strip=True))
    return full_text.strip()

with open("cnn.json", "r") as f:
    articles = json.load(f)

final_articles = []


for article in articles:
    try:
        print(f"Scraping: {article['title'][:50]}...")
        content = get_cnn_article_text(article["url"])
        if content:
            article["contents"] = content
            final_articles.append(article)
        else:
            print(" Skipped - No content found.")
        time.sleep(1)  
    except Exception as e:
        print(f"Error for {article.get('url', '')}: {e}")


with open("cnn_full.json", "w") as f:
    json.dump(final_articles, f, indent=2)

print(f"Done! Saved {len(final_articles)} valid articles to cnn_full.json.")
