import json
import time
import requests
from bs4 import BeautifulSoup
from scraper_interface import ScraperInterface

class BBCScrapper(ScraperInterface):
    def __init__(self):
        self.base_url = "https://www.bbc.com"
        self.news_url = self.base_url + "/news" 
        self.meta_file = "bbc_metadata.json"
        self.full_file = "bbc_content.json"
        self.articles = []

    def get_metadata(self):
        try:
            print("starting the bbc fetching")
            r= requests.get(self.news_url)
            soup = BeautifulSoup(r.content, 'html.parser')

            found = soup.find("script", {"id": "__NEXT_DATA__"})
            found_json = found.string
            parsed_json = json.loads(found_json)

            sections = parsed_json['props']['pageProps']['page']['@"news",']['sections']
            for section in sections:
                if 'content' in section:
                    for item in section['content']:
                        article = {
                            "title": item.get('title', ''),
                            "url": self.base_url + item.get('href', ''),
                            "source": "BBC"
                        }
                        self.articles.append(article)
            with open(self.meta_file, 'w') as f:
                json.dump(self.articles, f, indent=4)
            print("bbc metadata done")
        
        except Exception as e:
            print(f"error: {e}")

    def get_content(self):
        try:
            print("starting the bbc content fetching")

            if not self.articles:
                with open(self.meta_file, 'r') as f:
                    self.articles = json.load(f)

            for article in self.articles:
                print(f"scraping: {article['title'][:50]}")
                data = self.get_article_content(article['url'])

                if data and data.get("content") and data["content"] != "nil":
                    article['content'] = data["content"]
                    article['date_published'] = data.get("date_published")
                else:
                    print("empty")
                    continue

                time.sleep(1)

            
            self.articles = [a for a in self.articles if a.get("content")]

            with open(self.full_file, 'w') as f:
                json.dump(self.articles, f, indent=4)

            print("bbc content fetching complete.")
    
        except Exception as e:
            print(f"Error: {e}")

    def get_article_content(self, url):
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')

            paras = soup.select('div[data-component="text-block"] p')
            if not paras:
                return {"content": None, "date_published": None}

            full_text = "\n".join(p.get_text(strip=True) for p in paras)

            time_tag = soup.find("time")
            date_published = time_tag["datetime"] if time_tag and "datetime" in time_tag.attrs else None

            return {
                "content": full_text.strip(),
                "date_published": date_published
            }

        except Exception as e:
            print(f"Error scraping article: {e}")
            return {"content": None, "date_published": None}

       