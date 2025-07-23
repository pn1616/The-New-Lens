#!/bin/bash

# Flask News Analysis API Startup Script

echo "🚀 Starting Flask News Analysis API..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies if needed
if [ ! -f "venv/.deps_installed" ]; then
    echo "📥 Installing dependencies..."
    ./install_deps.sh
fi

# Check PostgreSQL setup
if [ ! -f ".env" ]; then
    echo "⚠️  PostgreSQL not configured!"
    echo "   Run: python3 setup_postgres.py"
    exit 1
fi

# Check if scraped data exists
if [ ! -f "scrapper/cnn_content.json" ] || [ ! -f "scrapper/bbc_content.json" ]; then
    echo "⚠️  Warning: Scraped data files not found!"
    echo "   Please ensure the following files exist:"
    echo "   - scrapper/cnn_content.json"
    echo "   - scrapper/bbc_content.json"
fi

echo "🌐 Starting Flask server..."
echo "📊 The API will be available at: http://localhost:5000"
echo "📖 API Documentation: http://localhost:5000/"
echo ""
echo "Available endpoints:"
echo "  POST /cluster          - Cluster articles by topic"
echo "  POST /analyze          - Perform sentiment analysis and bias detection"
echo "  GET  /summary          - Get analysis summary"
echo "  POST /full-analysis    - Run complete analysis pipeline"
echo "  POST /ask              - Direct Ollama queries (legacy)"
echo ""
echo "🔥 Press Ctrl+C to stop the server"
echo ""

# Run the Flask application
python3 app.py