# Flask News Analysis API

A comprehensive Flask application that integrates with Ollama to perform automated news analysis including clustering, sentiment analysis, and bias detection on scraped news data.

## Features

- **Data Management**: Automatically loads scraped news data from CNN and BBC into SQLite database
- **Article Clustering**: Groups articles by similar topics using Ollama's LLM capabilities
- **Sentiment Analysis**: Analyzes emotional tone of articles (-1.0 to 1.0 scale)
- **Bias Detection**: Identifies potential bias in news articles (0.0 to 1.0 scale)
- **Neutral POV Generation**: Creates neutral summaries removing bias and emotional language
- **Comprehensive Analytics**: Provides detailed statistics and summaries

## Prerequisites

1. **Ollama Installation**: Make sure Ollama is installed and running
   ```bash
   # Install Ollama (if not already installed)
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Pull the required model
   ollama pull llama3
   
   # Start Ollama service
   ollama serve
   ```

2. **Python Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Ensure your scraped data files exist:
   - `scrapper/cnn_content.json`
   - `scrapper/bbc_content.json`

4. Run the Flask application:
   ```bash
   python app.py
   ```

The application will:
- Initialize the SQLite database (`news_analysis.db`)
- Load scraped data into the database
- Start the Flask server on `http://localhost:5000`

## API Endpoints

### 1. Home - `GET /`
Returns API information and available endpoints.

### 2. Cluster Articles - `POST /cluster`
Groups articles by topic using Ollama.

**Example Request:**
```bash
curl -X POST http://localhost:5000/cluster
```

**Response:**
```json
{
  "success": true,
  "clusters": {
    "clusters": [
      {
        "cluster_id": 1,
        "topic": "International Politics",
        "description": "Articles about global political events",
        "article_indices": [1, 3, 5]
      }
    ]
  }
}
```

### 3. Analyze Sentiment & Bias - `POST /analyze`
Performs sentiment analysis and bias detection on clustered articles.

**Example Request:**
```bash
curl -X POST http://localhost:5000/analyze
```

**Response:**
```json
{
  "success": true,
  "analyzed_articles": 10,
  "results": [
    {
      "article_id": 1,
      "title": "Article Title",
      "cluster_id": 1,
      "cluster_topic": "International Politics",
      "sentiment": {
        "sentiment_score": 0.2,
        "sentiment_label": "positive",
        "reasoning": "Overall positive tone"
      },
      "bias": {
        "bias_score": 0.3,
        "bias_type": "neutral",
        "reasoning": "Minimal bias detected"
      },
      "neutral_summary": "Neutral summary of the article..."
    }
  ]
}
```

### 4. Get Analysis Summary - `GET /summary`
Returns comprehensive statistics and cluster summaries.

**Example Request:**
```bash
curl http://localhost:5000/summary
```

**Response:**
```json
{
  "overall_statistics": {
    "total_articles": 50,
    "overall_sentiment": 0.15,
    "overall_bias": 0.25,
    "total_clusters": 5
  },
  "clusters": [
    {
      "cluster_id": 1,
      "topic": "International Politics",
      "article_count": 12,
      "avg_sentiment": 0.1,
      "avg_bias": 0.3
    }
  ]
}
```

### 5. Full Analysis Pipeline - `POST /full-analysis`
Runs the complete analysis pipeline: clustering → sentiment/bias analysis → summary.

**Example Request:**
```bash
curl -X POST http://localhost:5000/full-analysis
```

### 6. Direct Ollama Query - `POST /ask` (Legacy)
Direct interface to Ollama for custom queries.

**Example Request:**
```bash
curl -X POST http://localhost:5000/ask \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What is machine learning?"}'
```

## Database Schema

### Articles Table
- `id`: Primary key
- `title`: Article title
- `url`: Article URL (unique)
- `source`: News source (CNN, BBC, etc.)
- `content`: Full article content
- `date_published`: Publication date
- `created_at`: Record creation timestamp

### Analysis Results Table
- `id`: Primary key
- `article_id`: Foreign key to articles table
- `cluster_id`: Cluster identifier
- `cluster_topic`: Cluster topic name
- `sentiment_score`: Sentiment score (-1.0 to 1.0)
- `sentiment_label`: Sentiment category (positive/negative/neutral)
- `bias_score`: Bias score (0.0 to 1.0)
- `bias_type`: Bias category (political_left/right/corporate/sensationalist/neutral)
- `neutral_summary`: Neutral POV summary
- `analysis_timestamp`: Analysis timestamp

## Analysis Workflow

1. **Data Loading**: Scraped articles are loaded into SQLite database
2. **Clustering**: Articles are grouped by topic using Ollama
3. **Sentiment Analysis**: Each article gets a sentiment score and label
4. **Bias Detection**: Articles are analyzed for potential bias
5. **Neutral Summary**: Bias-free summaries are generated
6. **Statistics**: Comprehensive analytics are computed

## Configuration

Key configuration variables in `app.py`:
- `OLLAMA_API`: Ollama API endpoint (default: `http://localhost:11434/api/generate`)
- `DATABASE_PATH`: SQLite database file path (default: `news_analysis.db`)

## Error Handling

The application includes comprehensive error handling:
- Database connection errors
- Ollama API failures
- JSON parsing errors
- Missing data validation

## Logging

The application logs important events:
- Database initialization
- Data loading progress
- Analysis errors
- API call failures

## Performance Considerations

- Articles are truncated for clustering (500 chars) and analysis (1000 chars) to manage token limits
- Database uses indexes for efficient queries
- Ollama calls include timeouts (120 seconds)
- Analysis runs sequentially to avoid overwhelming Ollama

## Troubleshooting

1. **Ollama Connection Issues**:
   - Ensure Ollama is running: `ollama serve`
   - Check if llama3 model is available: `ollama list`

2. **Database Issues**:
   - Delete `news_analysis.db` to reset database
   - Check file permissions in backend directory

3. **Missing Data**:
   - Ensure scrapper JSON files exist and contain valid data
   - Check file paths in `load_scraped_data()` method

4. **Memory Issues**:
   - Consider reducing article content length in prompts
   - Process articles in smaller batches

## Future Enhancements

- Support for additional news sources
- Real-time analysis via websockets
- Advanced clustering algorithms
- Export functionality (CSV, JSON)
- Web dashboard for visualization
- Caching for improved performance