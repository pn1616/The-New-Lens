from flask import Flask, request, jsonify
import requests
import json
import sqlite3
import os
from datetime import datetime
import logging
from typing import List, Dict, Any

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
OLLAMA_API = "http://localhost:11434/api/generate"
DATABASE_PATH = "news_analysis.db"

class NewsAnalyzer:
    def __init__(self):
        self.init_database()
        self.load_scraped_data()
    
    def init_database(self):
        """Initialize SQLite database with required tables"""
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        # Create articles table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS articles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                url TEXT UNIQUE NOT NULL,
                source TEXT NOT NULL,
                content TEXT NOT NULL,
                date_published TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create analysis results table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS analysis_results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                article_id INTEGER,
                cluster_id INTEGER,
                cluster_topic TEXT,
                sentiment_score REAL,
                sentiment_label TEXT,
                bias_score REAL,
                bias_type TEXT,
                neutral_summary TEXT,
                analysis_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (article_id) REFERENCES articles (id)
            )
        ''')
        
        conn.commit()
        conn.close()
        logger.info("Database initialized successfully")
    
    def load_scraped_data(self):
        """Load scraped data from JSON files into database"""
        try:
            # Load CNN data
            with open('scrapper/cnn_content.json', 'r', encoding='utf-8') as f:
                cnn_data = json.load(f)
            
            # Load BBC data
            with open('scrapper/bbc_content.json', 'r', encoding='utf-8') as f:
                bbc_data = json.load(f)
            
            # Insert data into database
            conn = sqlite3.connect(DATABASE_PATH)
            cursor = conn.cursor()
            
            for article in cnn_data + bbc_data:
                cursor.execute('''
                    INSERT OR IGNORE INTO articles (title, url, source, content, date_published)
                    VALUES (?, ?, ?, ?, ?)
                ''', (
                    article.get('title', ''),
                    article.get('url', ''),
                    article.get('source', ''),
                    article.get('content', ''),
                    article.get('date', article.get('date_published', ''))
                ))
            
            conn.commit()
            conn.close()
            logger.info("Scraped data loaded into database successfully")
            
        except Exception as e:
            logger.error(f"Error loading scraped data: {str(e)}")
    
    def call_ollama(self, prompt: str, model: str = "llama3") -> str:
        """Make API call to Ollama"""
        payload = {
            "model": model,
            "prompt": prompt,
            "stream": False
        }
        
        try:
            response = requests.post(OLLAMA_API, json=payload, timeout=120)
            response.raise_for_status()
            result = response.json()
            return result.get("response", "")
        except requests.exceptions.RequestException as e:
            logger.error(f"Ollama API error: {str(e)}")
            raise
    
    def cluster_articles(self) -> Dict[str, Any]:
        """Cluster articles by topic using Ollama"""
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        # Get all articles
        cursor.execute("SELECT id, title, content FROM articles")
        articles = cursor.fetchall()
        
        if not articles:
            return {"error": "No articles found in database"}
        
        # Prepare articles for clustering
        article_summaries = []
        for article_id, title, content in articles:
            # Truncate content for clustering (first 500 chars)
            summary = f"Title: {title}\nContent: {content[:500]}..."
            article_summaries.append((article_id, title, summary))
        
        # Create clustering prompt
        clustering_prompt = f"""
        I have {len(article_summaries)} news articles. Please analyze them and group them into clusters based on similar topics or themes.
        
        Articles:
        {chr(10).join([f"{i+1}. {summary}" for i, (_, _, summary) in enumerate(article_summaries)])}
        
        Please provide the clustering results in the following JSON format:
        {{
            "clusters": [
                {{
                    "cluster_id": 1,
                    "topic": "Topic Name",
                    "description": "Brief description of the cluster theme",
                    "article_indices": [1, 3, 5]
                }}
            ]
        }}
        
        Only return the JSON, no additional text.
        """
        
        try:
            clustering_result = self.call_ollama(clustering_prompt)
            
            # Parse clustering result
            import re
            json_match = re.search(r'\{.*\}', clustering_result, re.DOTALL)
            if json_match:
                clusters_data = json.loads(json_match.group())
                
                # Store clustering results
                for cluster in clusters_data.get("clusters", []):
                    cluster_id = cluster.get("cluster_id")
                    topic = cluster.get("topic", "Unknown")
                    
                    for article_index in cluster.get("article_indices", []):
                        if 1 <= article_index <= len(article_summaries):
                            article_id = article_summaries[article_index - 1][0]
                            
                            cursor.execute('''
                                INSERT OR REPLACE INTO analysis_results 
                                (article_id, cluster_id, cluster_topic) 
                                VALUES (?, ?, ?)
                            ''', (article_id, cluster_id, topic))
                
                conn.commit()
                conn.close()
                return {"success": True, "clusters": clusters_data}
            else:
                conn.close()
                return {"error": "Failed to parse clustering results"}
                
        except Exception as e:
            conn.close()
            logger.error(f"Clustering error: {str(e)}")
            return {"error": f"Clustering failed: {str(e)}"}
    
    def analyze_sentiment_and_bias(self) -> Dict[str, Any]:
        """Perform sentiment analysis and bias detection on clustered articles"""
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        # Get articles with cluster information
        cursor.execute('''
            SELECT a.id, a.title, a.content, ar.cluster_id, ar.cluster_topic
            FROM articles a
            JOIN analysis_results ar ON a.id = ar.article_id
            WHERE ar.cluster_id IS NOT NULL
        ''')
        
        articles = cursor.fetchall()
        results = []
        
        for article_id, title, content, cluster_id, cluster_topic in articles:
            # Sentiment Analysis
            sentiment_prompt = f"""
            Analyze the sentiment of this news article and provide a sentiment score from -1.0 (very negative) to 1.0 (very positive), with 0.0 being neutral.
            
            Title: {title}
            Content: {content[:1000]}...
            
            Respond in JSON format:
            {{
                "sentiment_score": 0.0,
                "sentiment_label": "neutral|positive|negative",
                "reasoning": "Brief explanation"
            }}
            
            Only return the JSON, no additional text.
            """
            
            # Bias Detection
            bias_prompt = f"""
            Analyze this news article for potential bias and provide a bias score from 0.0 (completely neutral) to 1.0 (heavily biased).
            
            Title: {title}
            Content: {content[:1000]}...
            
            Consider factors like:
            - Language choice (loaded words, emotional language)
            - Source selection and attribution
            - Framing of the story
            - Missing perspectives or context
            
            Respond in JSON format:
            {{
                "bias_score": 0.0,
                "bias_type": "political_left|political_right|corporate|sensationalist|neutral",
                "reasoning": "Brief explanation of detected bias"
            }}
            
            Only return the JSON, no additional text.
            """
            
            # Neutral POV Generation
            neutral_prompt = f"""
            Rewrite this news article from a completely neutral point of view, removing any bias, emotional language, or subjective framing. Focus on facts only.
            
            Original Title: {title}
            Original Content: {content[:800]}...
            
            Provide a neutral summary in 2-3 sentences that presents only the key facts without bias.
            """
            
            try:
                # Get sentiment analysis
                sentiment_result = self.call_ollama(sentiment_prompt)
                sentiment_data = self._extract_json(sentiment_result)
                
                # Get bias analysis
                bias_result = self.call_ollama(bias_prompt)
                bias_data = self._extract_json(bias_result)
                
                # Get neutral summary
                neutral_summary = self.call_ollama(neutral_prompt)
                
                # Update database with analysis results
                cursor.execute('''
                    UPDATE analysis_results SET
                        sentiment_score = ?,
                        sentiment_label = ?,
                        bias_score = ?,
                        bias_type = ?,
                        neutral_summary = ?,
                        analysis_timestamp = CURRENT_TIMESTAMP
                    WHERE article_id = ?
                ''', (
                    sentiment_data.get("sentiment_score", 0.0),
                    sentiment_data.get("sentiment_label", "neutral"),
                    bias_data.get("bias_score", 0.0),
                    bias_data.get("bias_type", "neutral"),
                    neutral_summary.strip(),
                    article_id
                ))
                
                results.append({
                    "article_id": article_id,
                    "title": title,
                    "cluster_id": cluster_id,
                    "cluster_topic": cluster_topic,
                    "sentiment": sentiment_data,
                    "bias": bias_data,
                    "neutral_summary": neutral_summary.strip()
                })
                
            except Exception as e:
                logger.error(f"Error analyzing article {article_id}: {str(e)}")
                continue
        
        conn.commit()
        conn.close()
        
        return {"success": True, "analyzed_articles": len(results), "results": results}
    
    def _extract_json(self, text: str) -> Dict[str, Any]:
        """Extract JSON from Ollama response"""
        import re
        try:
            json_match = re.search(r'\{.*\}', text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            return {}
        except:
            return {}
    
    def get_analysis_summary(self) -> Dict[str, Any]:
        """Get summary of all analysis results"""
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        # Get cluster summary
        cursor.execute('''
            SELECT cluster_id, cluster_topic, COUNT(*) as article_count,
                   AVG(sentiment_score) as avg_sentiment,
                   AVG(bias_score) as avg_bias
            FROM analysis_results 
            WHERE cluster_id IS NOT NULL
            GROUP BY cluster_id, cluster_topic
            ORDER BY cluster_id
        ''')
        
        clusters = cursor.fetchall()
        
        # Get overall statistics
        cursor.execute('''
            SELECT 
                COUNT(*) as total_articles,
                AVG(sentiment_score) as overall_sentiment,
                AVG(bias_score) as overall_bias,
                COUNT(DISTINCT cluster_id) as total_clusters
            FROM analysis_results
            WHERE sentiment_score IS NOT NULL
        ''')
        
        stats = cursor.fetchone()
        
        conn.close()
        
        return {
            "overall_statistics": {
                "total_articles": stats[0] if stats else 0,
                "overall_sentiment": round(stats[1], 3) if stats and stats[1] else 0,
                "overall_bias": round(stats[2], 3) if stats and stats[2] else 0,
                "total_clusters": stats[3] if stats else 0
            },
            "clusters": [
                {
                    "cluster_id": cluster[0],
                    "topic": cluster[1],
                    "article_count": cluster[2],
                    "avg_sentiment": round(cluster[3], 3) if cluster[3] else 0,
                    "avg_bias": round(cluster[4], 3) if cluster[4] else 0
                }
                for cluster in clusters
            ]
        }

# Initialize analyzer
analyzer = NewsAnalyzer()

@app.route("/")
def home():
    return jsonify({
        "message": "Flask News Analysis API is running!",
        "endpoints": [
            "/cluster - POST: Cluster articles by topic",
            "/analyze - POST: Perform sentiment analysis and bias detection",
            "/summary - GET: Get analysis summary",
            "/full-analysis - POST: Run complete analysis pipeline"
        ]
    })

@app.route("/cluster", methods=["POST"])
def cluster_articles():
    """Cluster articles by topic"""
    try:
        result = analyzer.cluster_articles()
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": f"Clustering failed: {str(e)}"}), 500

@app.route("/analyze", methods=["POST"])
def analyze_sentiment_bias():
    """Perform sentiment analysis and bias detection"""
    try:
        result = analyzer.analyze_sentiment_and_bias()
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500

@app.route("/summary", methods=["GET"])
def get_summary():
    """Get analysis summary"""
    try:
        result = analyzer.get_analysis_summary()
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": f"Failed to get summary: {str(e)}"}), 500

@app.route("/full-analysis", methods=["POST"])
def full_analysis():
    """Run the complete analysis pipeline"""
    try:
        # Step 1: Cluster articles
        cluster_result = analyzer.cluster_articles()
        if "error" in cluster_result:
            return jsonify(cluster_result), 500
        
        # Step 2: Analyze sentiment and bias
        analysis_result = analyzer.analyze_sentiment_and_bias()
        if "error" in analysis_result:
            return jsonify(analysis_result), 500
        
        # Step 3: Get summary
        summary = analyzer.get_analysis_summary()
        
        return jsonify({
            "success": True,
            "message": "Complete analysis pipeline executed successfully",
            "clustering": cluster_result,
            "analysis": {
                "analyzed_articles": analysis_result.get("analyzed_articles", 0)
            },
            "summary": summary
        })
        
    except Exception as e:
        return jsonify({"error": f"Full analysis failed: {str(e)}"}), 500

# Legacy endpoint for compatibility
@app.route("/ask", methods=["POST"])
def ask_llama():
    """Legacy endpoint for direct Ollama queries"""
    user_prompt = request.json.get("prompt", "")

    if not user_prompt:
        return jsonify({"error": "Prompt is missing."}), 400

    try:
        response = analyzer.call_ollama(user_prompt)
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": f"Ollama error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
