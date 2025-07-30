import psycopg2
import json
import subprocess
import textwrap

# === DB Config ===
DB_NAME = "news"
DB_USER = "dell"
DB_PASSWORD = "dell"
DB_HOST = "localhost"
DB_PORT = "5432"

# === DB Connection Helper ===
def get_connection():
    return psycopg2.connect(
        dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD,
        host=DB_HOST, port=DB_PORT
    )

# === Fetch Articles ===
def fetch_articles_from_db():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT news_id, title, description, source_id
        FROM news
        -- WHERE is_clustered = FALSE
        LIMIT 100
    """)

    rows = cur.fetchall()
    articles = []
    for row in rows:
        articles.append({
          
            'news_id': row[0],
            'title': row[1] or "",
            'content': row[2] or "",
            'source': row[3],
        })

    cur.close()
    conn.close()
    return articles

# === Prompt Builder ===
def build_prompt(batch):
    return "\n\n".join([
        f"Article {a['news_id']}:\nTitle: {a['title']}\nSource: {a['source']}\nContent: {a['content'][:300]}..."
        for i, a in enumerate(batch) #fix 
    ])

# === LLaMA Call ===
def call_llama(prompt):
    full_prompt = textwrap.dedent(f"""
        You are an advanced AI system for analyzing news articles. Your role is to:

        1. Cluster Articles
        - Group similar articles from different sources (use source_id to differentiate)
        -  cluster_date MUST be today's date.
        - Base clustering on topic similarity, shared entities, timeframes, and event relationships.
        - Ensure articles in a cluster represent the same story. Handle edge cases carefully.

        2. Generate Cluster Summaries
        - Write one unbiased summary per cluster combining facts from all articles.
        - Include key details: who, what, when, where, why, and how.
        - Length: 150–300 words.
        - Highlight contradictions neutrally.

        3. Analyze Each Article
        - Sentiment
        - Overall sentiment: Positive, Negative, Neutral, or Mixed
        - Bias
        - Bias direction: Left, Right, Center, or Neutral

        Output Format (strictly VALID JSON array with the accurate indentation). MUST NOT include any starting texts or explanations.MUST NOT even say 'Here is the output in the required JSON format:'. This response is directly parsed to json. MUST ONLY stick to the following format:
        [
          {{
            "cluster_date": "YYYY-MM-DD",
            "theme": "Concise cluster title",
            "articles": [
              {{
                "news_id": "the news_id of the article as an integer",
                "sentiment": "Positive" | "Negative" | "Neutral" | "Mixed",
                "bias": "Left" | "Right" | "Center" | "Neutral"
              }},
              ...
            ],
            "summary": "Concise summary of the cluster"
          }},
          ...
        ]

        {prompt}
    """).strip()

    process = subprocess.Popen(
        ["ollama", "run", "llama3"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        text=True
    )
    output, _ = process.communicate(full_prompt)
    return output.strip()

# === Update DB: mark clustered articles ===
def mark_articles_clustered(article_ids):
    if not article_ids:
        return
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "UPDATE news SET is_clustered = TRUE WHERE news_id = ANY(%s)",
        (article_ids,)
    )
    conn.commit()
    cur.close()
    conn.close()

# === Main Runner ===
def cluster_articles():
    all_articles = fetch_articles_from_db()
    print(f"Fetched {len(all_articles)} articles from DB")

    batch_size = 10
    clustered_data = []
    clustered_ids = set()

    for i in range(0, len(all_articles), batch_size):
        batch = all_articles[i:i+batch_size]
        print(f"\nProcessing batch {i//batch_size + 1} with {len(batch)} articles")

    prompt = build_prompt(all_articles)
    response = call_llama(prompt)

    try:
        clusters = json.loads(response)
        clustered_data.extend(clusters)

        for cluster in clusters:
            clustered_ids.update(cluster["articles"])

    except json.JSONDecodeError:
        print("Failed to parse LLaMA output:")
        print(response)
        return

    with open("clusters_output.json", "w") as f:
        json.dump(clusters, f, indent=2)
    print("\nClustered data saved to clusters_output.json")

    # Update DB
    if clustered_ids:
         mark_articles_clustered(list(clustered_ids))
         print(f"Marked {len(clustered_ids)} articles as clustered in DB")

if __name__ == "__main__":
    cluster_articles()
