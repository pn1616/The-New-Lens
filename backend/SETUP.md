# Quick Setup Guide

## Prerequisites

1. **PostgreSQL** database server:
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```

2. **Ollama** must be installed and running:
   ```bash
   # Install Ollama
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Pull the required model
   ollama pull llama3
   
   # Start Ollama service (in a separate terminal)
   ollama serve
   ```

3. **Python 3.8+** with pip and venv support

## Quick Start

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Setup PostgreSQL database:**
   ```bash
   python3 setup_postgres.py
   ```
   
   This will:
   - Install PostgreSQL (if needed)
   - Create the `news_analysis` database
   - Set up database user and permissions
   - Create `.env` configuration file

3. **Run the application:**
   ```bash
   ./run.sh
   ```

   This script will automatically:
   - Create a virtual environment
   - Install dependencies (including psycopg2)
   - Load scraped data into PostgreSQL
   - Start the Flask server

4. **Test the API:**
   ```bash
   # In another terminal
   cd backend
   source venv/bin/activate
   python3 example_usage.py
   ```

## Manual Setup

If you prefer manual setup:

```bash
# Setup PostgreSQL database
python3 setup_postgres.py

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

1. **PostgreSQL not running**: 
   - Check: `sudo systemctl status postgresql`
   - Start: `sudo systemctl start postgresql`
   - Run setup: `python3 setup_postgres.py`

2. **Database connection issues**:
   - Check `.env` file exists with correct credentials
   - Verify PostgreSQL is accepting connections
   - Run: `python3 setup_postgres.py` to recreate database

3. **Ollama not running**: Make sure `ollama serve` is running

4. **Port 5000 in use**: Change port in `app.py` (line with `app.run()`)

5. **Memory issues**: Reduce article content length in prompts

## File Structure

```
backend/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies (includes psycopg2)
├── setup_postgres.py   # PostgreSQL setup script
├── run.sh             # Startup script
├── test_setup.py      # Setup verification
├── example_usage.py   # API usage examples
├── README.md          # Comprehensive documentation
├── SETUP.md           # This quick setup guide
├── .env               # Database configuration (created by setup)
├── venv/              # Virtual environment
└── scrapper/          # Scraped data files
    ├── cnn_content.json
    └── bbc_content.json

PostgreSQL Database: news_analysis (external)
```