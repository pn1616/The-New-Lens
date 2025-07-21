import requests
from bs4 import BeautifulSoup
import json

url = "https://edition.cnn.com"
response = requests.get(url)
soup = BeautifulSoup(response.text, "html.parser")

articles = []

headline_spans = soup.find_all("span", class_="container__headline-text")

for span in headline_spans:
    title = span.get_text(strip=True)
    
    parent_a = span.find_parent("a")
    
    if title and parent_a and parent_a.has_attr("href"):
        link = parent_a["href"]
        
        if link.startswith("/"):
            link = f"https://edition.cnn.com{link}"
        
        articles.append({
            "title": title,
            "url": link
        })

with open("cnn.json", "w") as f:
    json.dump(articles, f, indent=2)

print(f"Saved {len(articles)} CNN headlines with URLs to cnn.json")

