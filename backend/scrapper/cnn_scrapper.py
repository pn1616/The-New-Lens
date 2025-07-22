import json
import time
import requests
from bs4 import BeautifulSoup
from scraper_interface import ScraperInterface

class CNNScrapper(ScraperInterface):
    def __init__(self):
        self.base_url = "https://edition.cnn.com"
        self.news_url = self.base_url  
        self.meta_file = "cnn_metadata.json"
        self.full_file = "cnn_content.json"
        self.articles = []

    def get_metadata(self):
        try:
            print("starting the cnn fetching")
            response = requests.get(self.news_url)
            soup = BeautifulSoup(response.text, "html.parser")

            headline_spans = soup.find_all("span", class_="container__headline-text")

            for span in headline_spans:
                title = span.get_text(strip=True)
                parent_a = span.find_parent("a")

                if title and parent_a and parent_a.has_attr("href"):
                    link = parent_a["href"]
                    if link.startswith("/"):
                        link = f"{self.base_url}{link}"

                    self.articles.append({
                        "title": title,
                        "url": link,
                        "source": "CNN",
                    })

            with open(self.meta_file, 'w') as f:
                json.dump(self.articles, f, indent=4)

            print("cnn metadata done")

        except Exception as e:
            print(f"error: {e}")

    def get_content(self):
        try:
            print("starting the cnn content fetching")

            if not self.articles:
                with open(self.meta_file, 'r') as f:
                    self.articles = json.load(f)

            for article in self.articles:
                print(f"scraping: {article['title'][:50]}")
                result = self.get_article_content(article['url'])

                if result:
                    article['content'] = result["content"]
                    article['date'] = result["date"]
                else:
                    print("empty")
                    continue

                time.sleep(1)

            self.articles = [a for a in self.articles if a.get("content")]

            with open(self.full_file, 'w') as f:
                json.dump(self.articles, f, indent=4)

            print("cnn content done")

        except Exception as e:
            print(f"error: {e}")


    def get_article_content(self, url):
        try:
            headers = {"User-Agent": "Mozilla/5.0"}
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, "html.parser")
            paragraphs = soup.find_all("p", attrs={"data-component-name": "paragraph"})

            if not paragraphs:
                return ""

            full_text = "\n".join(p.get_text(strip=True) for p in paragraphs if p.get_text(strip=True))

            date_text = "Unknown"

            ts1 = soup.find("div", class_="timestamp")
            if ts1:
                date_text = ts1.get_text(strip=True)

            ts2 = soup.find("div", class_="timestamp_published")
            if ts2:
                date_text = ts2.get_text(strip=True)

            return {
                "content": full_text.strip(),
                "date": date_text
            }

        except Exception as e:
            print(f"error ({url}): {e}")
            return ""
