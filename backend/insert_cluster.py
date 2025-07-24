import psycopg2
import json
from psycopg2 import IntegrityError, errors

conn = psycopg2.connect(
    dbname="news",
    user="dell",
    password="dell",
    host="localhost"
)

cur = conn.cursor()

JSON_FILE = "clusters_output.json"

with open(JSON_FILE, 'r') as f:
    clusters = json.load(f)

for cluster in clusters:
    cluster_date = cluster.get("cluster_date")
    title = cluster.get("theme")
    articles = cluster.get("articles", [])
    summary = cluster.get("summary")

    try:
        cur.execute("""
            INSERT INTO cluster (cluster_date, cluster_title, summary)
            VALUES (%s, %s, %s)
            RETURNING cluster_id;
        """, (cluster_date, title, summary))
        cluster_id = cur.fetchone()[0]

    except psycopg2.errors.UniqueViolation:
        conn.rollback()  
        cur.execute("""
            SELECT cluster_id FROM cluster
            WHERE cluster_date = %s AND cluster_title = %s;
        """, (cluster_date, title))
        cluster_id = cur.fetchone()[0]

    for article in articles:
        news_id = article.get("news_id")
        sentiment = article.get("sentiment")
        bias = article.get("bias")

        cur.execute("""
            UPDATE news
            SET sentiment = %s,
                bias = %s,
                is_clustered = TRUE
            WHERE news_id = %s;
        """, (sentiment, bias, news_id))

    
        try:
            cur.execute("""
                INSERT INTO news_cluster (news_id, cluster_id)
                VALUES (%s, %s);
            """, (news_id, cluster_id))
        except psycopg2.errors.UniqueViolation:
            conn.rollback()  

conn.commit()
cur.close()
conn.close()
print("Cluster insert complete.")
