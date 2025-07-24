import json
import psycopg2
import os

conn = psycopg2.connect(
    dbname="news",
    user="dell",
    password="dell",
    host="localhost"

)

cur = conn.cursor()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  
JSON_FILES = [
    #os.path.join(BASE_DIR, "scrapper", "cnn_content.json"),
    #os.path.join(BASE_DIR, "scrapper", "bbc_content.json"),
    os.path.join(BASE_DIR,"new.json")
]
for filename in JSON_FILES:
    with open(filename, 'r') as f:
        news_items = json.load(f)
        for item in news_items:
            cur.execute("""
                        INSERT INTO news (
                            news_date, title, description, source_id
                        ) VALUES (%s, %s, %s, %s)
                    """, (
                        item["date"],
                        item["title"],
                        item["content"],
                        item["source"]
    
                    ))
conn.commit()
cur.close()
conn.close()
print("news added to db")