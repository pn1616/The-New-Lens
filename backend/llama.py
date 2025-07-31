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
        - Base clustering on topic similarity, shared entities, and event relationships.
        - MUST NOT cluster articles that are not of the same topic.
        - Ensure articles in a cluster represent the same story. Handle edge cases carefully.

        2. Generate Cluster Summaries
        - Write one unbiased and neutral point of view summary per cluster combining facts from all articles.
        - Length: MUST BE ATLEAST 200 WORDS. 
        - Highlight contradictions neutrally.

        3. Analyze Each Article
        - Sentiment
        - Overall sentiment: Positive, Negative, Neutral.
        - Bias
        - Bias direction: Left, Right, Center, or Neutral

        Output Format (strictly VALID JSON array with the accurate indentation). MUST NOT include any starting texts or explanations.MUST NOT even say 'Here is the output in the required JSON format:'. This response is directly parsed to json. MUST ONLY stick to the following format:
        [
          {{
            "cluster_date": "YYYY-MM-DD",
            "theme": "Concise cluster title",
            "articles": [
              {{
                "news_id": 123,
                "sentiment": "Positive",
                "bias": "Left"
              }},
              {{
                "news_id": 456,
                "sentiment": "Negative",
                "bias": "Right"
              }}
            ],
            "summary": "Neutral point of view summary of the cluster atleast 200 words"
          }}
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

# === Update DB: mark analysed articles ===
def mark_articles_analysed(article_ids):
    if not article_ids:
        return
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "UPDATE news SET is_analysed = TRUE WHERE news_id = ANY(%s)",
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
    all_clustered_data = []
    all_clustered_ids = set()

    for i in range(0, len(all_articles), batch_size):
        batch = all_articles[i:i+batch_size]
        batch_num = i//batch_size + 1
        print(f"\nProcessing batch {batch_num} with {len(batch)} articles")
        
        # Build prompt for this specific batch
        prompt = build_prompt(batch)
        
        # Call LLaMA for this batch
        response = call_llama(prompt)
        
        try:
            clusters = json.loads(response)
            all_clustered_data.extend(clusters)
            
            batch_ids = set()
            for cluster in clusters:
                for article in cluster["articles"]:
                    article_id = article["news_id"]
                    all_clustered_ids.add(article_id)
                    batch_ids.add(article_id)
            
            print(f"✓ Batch {batch_num} processed successfully - {len(batch_ids)} articles clustered")
            
        except json.JSONDecodeError:
            print(f"✗ Failed to parse LLaMA output for batch {batch_num}:")
            print(response)
            print("Continuing with next batch...")
            continue

    # Save all clustered data to file
    with open("clusters_output.json", "w") as f:
        json.dump(all_clustered_data, f, indent=2)
    print(f"\n✓ All clustered data saved to clusters_output.json")

    # Update DB for all processed articles
    if all_clustered_ids:
         mark_articles_clustered(list(all_clustered_ids))
         mark_articles_analysed(list(all_clustered_ids))
         print(f"✓ Marked {len(all_clustered_ids)} articles as clustered and analysed in DB")
    else:
         print("✗ No articles were successfully processed")

if __name__ == "__main__":
    cluster_articles()