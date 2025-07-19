from bs4 import BeautifulSoup
import requests
import json

url = 'https://www.bbc.com/news'
r = requests.get(url)
soup = BeautifulSoup(r.text, 'html.parser')


found = soup.find("script", {"id": "__NEXT_DATA__"})
found_json = found.string
parsed_json = json.loads(found_json)


articles = []

for section in parsed_json['props']['pageProps']['page']['@"news",']['sections']:
    if 'content' in section:
        for item in section['content']:
            article = {
                "title": item.get('title'),
                "url": "https://www.bbc.com" + item.get('href', ''),  
                "description": item.get('description'),
            }
            articles.append(article)

with open('bbc.json','w') as f:
    json.dump(articles, f, indent=4)

print("we did it but check json for confirmation cant trust u lol")