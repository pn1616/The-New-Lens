from flask import Flask, jsonify
import psycopg2

app = Flask(__name__)

def get_connection():
    return psycopg2.connect(
        dbname="news",
        user="dell",
        password="dell",
        host="localhost"
    )

@app.route('/api/clusters', methods=['GET'])
def get_clusters():
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute("SELECT cluster_id, cluster_title, summary FROM cluster;")
    rows = cur.fetchall()

    clusters = []
    for row in rows:
        clusters.append({
            "id": row[0],
            "title": row[1],
            "summary": row[2]
        })

    cur.close()
    conn.close()
    return jsonify(clusters)

@app.route("/api/cluster/<int:cluster_id>/sources", methods=["GET"])
def get_sources_for_cluster(cluster_id):
    cur = get_connection().cursor()
    cur.execute("""
        SELECT DISTINCT n.news_id, s.source_name
        FROM news n
        JOIN news_cluster nc ON n.news_id = nc.news_id
        JOIN source s ON n.source_id = s.source_id
        WHERE nc.cluster_id = %s;

    """, (cluster_id,))
    
    sources = [{"article_id": row[0], "source": row[1]} for row in cur.fetchall()]
    cur.close()
    return jsonify(sources)

@app.route("/api/article/<int:article_id>", methods=["GET"])
def get_article(article_id):

    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT title, description, sentiment, bias
        FROM news
        WHERE news_id = %s
    """, (article_id,))
    
    row = cur.fetchone()
    #print("fetched row:", row)

    cur.close()
    conn.close()

    if not row:
        return jsonify({"error": "Article not found"}), 404

    return jsonify({
        "title": row[0],
        "content": row[1],
        "sentiment": row[2],
        "bias": row[3],
    })
    
