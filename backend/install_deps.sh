#!/bin/bash

echo "📦 Installing Flask News Analysis API Dependencies..."

# Install system dependencies for PostgreSQL
echo "🔧 Installing system dependencies..."
sudo apt update
sudo apt install -y postgresql postgresql-contrib postgresql-server-dev-all libpq-dev python3-dev build-essential

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "🐍 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install Python dependencies
echo "📥 Installing Python dependencies..."
pip install Flask==3.0.0
pip install requests==2.31.0  
pip install typing-extensions==4.8.0

# Install psycopg2-binary with fallback
echo "🐘 Installing PostgreSQL adapter..."
pip install psycopg2-binary==2.9.9 || {
    echo "⚠️  psycopg2-binary failed, trying psycopg2..."
    pip install psycopg2==2.9.9 || {
        echo "❌ Failed to install PostgreSQL adapter"
        echo "Please install manually:"
        echo "  sudo apt install postgresql-server-dev-all libpq-dev"
        echo "  pip install psycopg2-binary"
        exit 1
    }
}

# Mark dependencies as installed
touch venv/.deps_installed

echo "✅ All dependencies installed successfully!"
echo "🚀 Next steps:"
echo "1. Setup PostgreSQL: python3 setup_postgres.py"
echo "2. Run the application: ./run.sh"