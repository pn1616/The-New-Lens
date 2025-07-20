import json
import time
from bs4 import BeautifulSoup
import requests

def get_article(url):
    try:
        print(f"scrapping done")
        response = requests.get(url, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')
        paras = soup.select('div[data-component="text-block"] p')

        if not paras:
            print(f"nil")
            return ""

        full_text = "\n".join(p.get_text(strip=True) for p in paras)
        return full_text

    except Exception as e:
        print(f"error {e}")
        return ""

with open('bbc.json', 'r') as f:
    articles = json.load(f)

for article in articles:
    article["contents"] = get_article(article["url"])
    time.sleep(1)  

with open("bbc_full.json", 'w') as f:
    json.dump(articles, f, indent=2)
