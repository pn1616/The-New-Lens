from flask import Flask, jsonify
import psycopg2
from flask_cors import CORS
from flask import request

app = Flask(__name__)
CORS(app)

def get_connection():
    return psycopg2.connect(
        dbname="news",
        user="dell",
        password="dell",
        host="localhost"
    )

@app.route('/api/clusters', methods=['GET'])
def get_clusters():
    date = request.args.get("date")
    conn = get_connection()
    cur = conn.cursor()

    if date:
        cur.execute("SELECT cluster_id, cluster_title, cluster_date FROM cluster WHERE cluster_date = %s;", (date,))
    else:
        cur.execute("SELECT cluster_id, cluster_title, cluster_date FROM cluster;")

    rows = cur.fetchall()
    clusters = [{"id": row[0], "title": row[1], "date": row[2]} for row in rows]

    cur.close()
    conn.close()
    return jsonify(clusters)

@app.route("/api/cluster/<int:cluster_id>", methods=["GET"])
def get_cluster_details(cluster_id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT summary FROM cluster WHERE cluster_id = %s;", (cluster_id,))
    summary_row = cur.fetchone()
    summary = summary_row[0] if summary_row else None

    cur.execute("""
        SELECT DISTINCT n.news_id, s.source_name
        FROM news n
        JOIN news_cluster nc ON n.news_id = nc.news_id
        JOIN source s ON n.source_id = s.source_id
        WHERE nc.cluster_id = %s;
    """, (cluster_id,))
    sources = [{"article_id": row[0], "source": row[1]} for row in cur.fetchall()]

    cur.close()
    return jsonify({
        "summary": summary,
        "sources": sources
    })


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
    
@app.route("/api/articles", methods=["GET"])
def get_all_articles():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT sentiment, bias FROM news
    """)
    
    rows = cur.fetchall()
    cur.close()
    conn.close()

    articles = []
    for row in rows:
        articles.append({
            "sentiment": row[0],
            "bias": row[1]
        })

    return jsonify(articles)

@app.route("/api/source-distribution", methods=["GET"])
def get_source_distribution():
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
    SELECT s.source_name, COUNT(*)
    FROM news n
    JOIN source s ON n.source_id = s.source_id
    GROUP BY s.source_name;
""")

        rows = cur.fetchall()
        result = [{"source": row[0], "count": row[1]} for row in rows]
        return jsonify(result)
    except Exception as e:
        print("Error fetching source distribution:", e)
        return jsonify({"error": "Internal server error"}), 500
    finally:
        cur.close()
        conn.close()

@app.route("/api/sourcecount", methods=["GET"])
def get_source_count():
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute("""
                SELECT 
                s.source_name as source_name,
                n.bias,
                COUNT(*) as count
            FROM news n
            JOIN source s ON n.source_id = s.source_id
            GROUP BY s.source_name, n.bias
            ORDER BY s.source_name""")
    rows = cur.fetchall()

    data = {}
    for source_name, bias, count in rows:
        if source_name not in data:
            data[source_name] = {"source": source_name, "left": 0, "center": 0, "right": 0}
        data[source_name][bias.lower()] = count

    return jsonify(list(data.values()))

if __name__ == '__main__':
    app.run(debug=True)