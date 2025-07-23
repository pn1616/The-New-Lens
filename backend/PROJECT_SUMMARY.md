# Flask News Analysis API - Project Summary

## What We Built

A comprehensive **Flask web application** that integrates with **Ollama (LLaMA 3)** to perform automated news analysis including:

1. **Data Clustering** - Groups news articles by similar topics
2. **Sentiment Analysis** - Analyzes emotional tone of articles (-1.0 to 1.0 scale)  
3. **Bias Detection** - Identifies potential bias in news reporting (0.0 to 1.0 scale)
4. **Neutral POV Generation** - Creates unbiased summaries of articles

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Scraped Data  │───▶│  Flask API      │───▶│   Ollama LLM    │
│   (CNN/BBC)     │    │   + SQLite DB   │    │   (LLaMA 3)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                        │                        │
        ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ JSON Files      │    │ REST Endpoints  │    │ AI Analysis     │
│ • CNN Articles  │    │ • /cluster      │    │ • Clustering    │
│ • BBC Articles  │    │ • /analyze      │    │ • Sentiment     │
│                 │    │ • /summary      │    │ • Bias Detection│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Key Features

### 🎯 **Intelligent Clustering**
- Uses LLaMA 3 to automatically group articles by topic
- Identifies common themes across different news sources
- Stores clustering results in database for fast retrieval

### 🧠 **Sentiment Analysis** 
- Analyzes emotional tone of each article
- Provides numerical score (-1.0 negative to 1.0 positive)
- Categorizes as positive, negative, or neutral

### ⚖️ **Bias Detection**
- Identifies potential bias in news reporting
- Analyzes language choice, framing, and missing perspectives
- Categorizes bias type (political, corporate, sensationalist, etc.)

### 📝 **Neutral Summary Generation**
- Creates unbiased summaries of articles
- Removes emotional language and subjective framing
- Focuses on factual content only

### 📊 **Comprehensive Analytics**
- Overall statistics across all articles
- Cluster-level breakdowns
- Exportable results via REST API

## Technical Stack

- **Backend**: Flask (Python)
- **Database**: PostgreSQL with two main tables:
  - `articles` - Stores news article data
  - `analysis_results` - Stores AI analysis results
- **Database Driver**: psycopg2-binary for PostgreSQL connectivity
- **AI Engine**: Ollama with LLaMA 3 model
- **Data Format**: JSON input, REST API output

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API documentation and status |
| POST | `/cluster` | Group articles by topic |
| POST | `/analyze` | Run sentiment/bias analysis |
| GET | `/summary` | Get analysis statistics |
| POST | `/full-analysis` | Complete pipeline |
| POST | `/ask` | Direct LLM queries |

## Data Flow

1. **Data Loading**: Scraped articles from CNN/BBC loaded into PostgreSQL
2. **Clustering**: LLaMA 3 groups articles by similar topics
3. **Analysis**: Each article analyzed for sentiment and bias
4. **Summarization**: Neutral POV summaries generated
5. **Aggregation**: Statistics computed across clusters and articles

## Files Created

### Core Application
- `app.py` - Main Flask application with PostgreSQL support
- `requirements.txt` - Python dependencies (includes psycopg2)

### Database Setup
- `setup_postgres.py` - PostgreSQL database setup script
- `.env` - Database configuration file (created by setup)
- `install_deps.sh` - Dependency installation script

### Scripts & Tools
- `run.sh` - Easy startup script
- `test_setup.py` - Setup verification tool
- `example_usage.py` - API usage examples

### Documentation
- `README.md` - Comprehensive documentation
- `SETUP.md` - Quick setup guide
- `PROJECT_SUMMARY.md` - This summary

## Usage Examples

### Setup and Start
```bash
cd backend
python3 setup_postgres.py  # Setup PostgreSQL database
./run.sh                   # Start the server
```

### Run Full Analysis
```bash
curl -X POST http://localhost:5000/full-analysis
```

### Get Results Summary
```bash
curl http://localhost:5000/summary
```

## Key Benefits

1. **Automated Analysis** - No manual intervention needed
2. **Scalable** - Can process hundreds of articles
3. **Unbiased** - AI-powered neutral perspective generation
4. **Comprehensive** - Covers clustering, sentiment, and bias
5. **Easy Integration** - REST API for external applications

## Performance Considerations

- Articles truncated to manage token limits
- Sequential processing to avoid overwhelming Ollama
- Database indexing for efficient queries
- Configurable timeouts for long-running operations

## Future Enhancements

- Support for additional news sources
- Real-time analysis via websockets
- Advanced clustering algorithms
- Export functionality (CSV, JSON)
- Web dashboard for visualization
- Caching for improved performance

## Requirements Met

✅ **Flask Backend** - Complete Flask application with REST API  
✅ **Ollama Integration** - Full integration with LLaMA 3 model  
✅ **Database Storage** - PostgreSQL for robust data storage  
✅ **Data Clustering** - AI-powered topic clustering  
✅ **Sentiment Analysis** - Emotional tone analysis  
✅ **Bias Detection** - Media bias identification  
✅ **Neutral POV** - Unbiased summary generation  
✅ **No Frontend Dependency** - Fully backend-driven analysis  

## Ready to Use

The application is **production-ready** with:
- Comprehensive error handling
- Detailed logging
- Setup verification tools
- Usage examples
- Complete documentation

Simply setup PostgreSQL with `python3 setup_postgres.py`, ensure Ollama is running with LLaMA 3, then execute `./run.sh` to start analyzing news data!