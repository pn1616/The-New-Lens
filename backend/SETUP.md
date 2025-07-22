# Quick Setup Guide

## Prerequisites

1. **Ollama** must be installed and running:
   ```bash
   # Install Ollama
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Pull the required model
   ollama pull llama3
   
   # Start Ollama service (in a separate terminal)
   ollama serve
   ```

2. **Python 3.8+** with pip and venv support

## Quick Start

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Run the application:**
   ```bash
   ./run.sh
   ```

   This script will automatically:
   - Create a virtual environment
   - Install dependencies
   - Load scraped data into database
   - Start the Flask server

3. **Test the API:**
   ```bash
   # In another terminal
   cd backend
   source venv/bin/activate
   python3 example_usage.py
   ```

## Manual Setup

If you prefer manual setup:

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the application
python3 app.py
```

## API Endpoints

- `GET /` - API documentation
- `POST /cluster` - Cluster articles by topic
- `POST /analyze` - Sentiment analysis and bias detection
- `GET /summary` - Get analysis summary
- `POST /full-analysis` - Complete analysis pipeline
- `POST /ask` - Direct Ollama queries

## Testing

Use the included test script:
```bash
python3 test_setup.py
```

## Troubleshooting

1. **Ollama not running**: Make sure `ollama serve` is running
2. **Port 5000 in use**: Change port in `app.py` (line with `app.run()`)
3. **Database issues**: Delete `news_analysis.db` to reset
4. **Memory issues**: Reduce article content length in prompts

## File Structure

```
backend/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── run.sh             # Startup script
├── test_setup.py      # Setup verification
├── example_usage.py   # API usage examples
├── README.md          # Comprehensive documentation
├── SETUP.md           # This quick setup guide
├── venv/              # Virtual environment
├── scrapper/          # Scraped data files
│   ├── cnn_content.json
│   └── bbc_content.json
└── news_analysis.db   # SQLite database (created automatically)
```