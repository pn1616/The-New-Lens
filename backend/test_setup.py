#!/usr/bin/env python3
"""
Test script to verify Flask News Analysis API setup with PostgreSQL
"""

import requests
import json
import time
import sys
import os
import psycopg2

def test_ollama_connection():
    """Test if Ollama is running and accessible"""
    print("Testing Ollama connection...")
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3",
                "prompt": "Hello, are you working?",
                "stream": False
            },
            timeout=30
        )
        if response.status_code == 200:
            print("✅ Ollama is running and accessible")
            return True
        else:
            print(f"❌ Ollama returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to Ollama. Make sure it's running on localhost:11434")
        return False
    except requests.exceptions.Timeout:
        print("❌ Ollama request timed out")
        return False
    except Exception as e:
        print(f"❌ Error connecting to Ollama: {str(e)}")
        return False

def test_postgresql_connection():
    """Test PostgreSQL database connection"""
    print("Testing PostgreSQL connection...")
    
    # Load environment variables
    def load_env_file():
        env_file = '.env'
        if os.path.exists(env_file):
            with open(env_file, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        key, value = line.split('=', 1)
                        os.environ[key] = value
    
    load_env_file()
    
    db_config = {
        'host': os.getenv('DB_HOST', 'localhost'),
        'database': os.getenv('DB_NAME', 'news_analysis'),
        'user': os.getenv('DB_USER', 'postgres'),
        'password': os.getenv('DB_PASSWORD', 'postgres'),
        'port': os.getenv('DB_PORT', '5432')
    }
    
    try:
        conn = psycopg2.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("SELECT version()")
        version = cursor.fetchone()
        print(f"✅ PostgreSQL is running: {version[0][:50]}...")
        
        # Check if tables exist
        cursor.execute("""
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        tables = cursor.fetchall()
        table_names = [table[0] for table in tables]
        
        if 'articles' in table_names and 'analysis_results' in table_names:
            print("✅ Required tables exist")
        else:
            print("⚠️  Required tables not found (will be created automatically)")
        
        cursor.close()
        conn.close()
        return True
        
    except psycopg2.Error as e:
        print(f"❌ PostgreSQL connection failed: {str(e)}")
        print("💡 Run: python3 setup_postgres.py")
        return False

def test_data_files():
    """Test if scraped data files exist"""
    print("Checking for scraped data files...")
    
    files_to_check = [
        "scrapper/cnn_content.json",
        "scrapper/bbc_content.json"
    ]
    
    all_exist = True
    for file_path in files_to_check:
        if os.path.exists(file_path):
            print(f"✅ Found {file_path}")
            # Check if file has content
            try:
                with open(file_path, 'r') as f:
                    data = json.load(f)
                    print(f"   - Contains {len(data)} articles")
            except Exception as e:
                print(f"   - Warning: Could not read file content: {e}")
        else:
            print(f"❌ Missing {file_path}")
            all_exist = False
    
    return all_exist

def test_flask_app():
    """Test Flask app endpoints"""
    print("Testing Flask application...")
    
    base_url = "http://localhost:5000"
    
    # Test home endpoint
    try:
        response = requests.get(f"{base_url}/")
        if response.status_code == 200:
            print("✅ Flask app is running and accessible")
            return True
        else:
            print(f"❌ Flask app returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to Flask app. Make sure it's running on localhost:5000")
        return False
    except Exception as e:
        print(f"❌ Error connecting to Flask app: {str(e)}")
        return False

def run_quick_analysis_test():
    """Run a quick test of the analysis pipeline"""
    print("Running quick analysis test...")
    
    base_url = "http://localhost:5000"
    
    try:
        # Test clustering
        print("  Testing clustering...")
        response = requests.post(f"{base_url}/cluster", timeout=60)
        if response.status_code == 200:
            result = response.json()
            if result.get("success"):
                print("  ✅ Clustering test passed")
            else:
                print(f"  ❌ Clustering failed: {result.get('error', 'Unknown error')}")
                return False
        else:
            print(f"  ❌ Clustering request failed with status: {response.status_code}")
            return False
        
        # Test summary endpoint
        print("  Testing summary...")
        response = requests.get(f"{base_url}/summary", timeout=30)
        if response.status_code == 200:
            result = response.json()
            print(f"  ✅ Summary test passed - {result.get('overall_statistics', {}).get('total_articles', 0)} articles processed")
            return True
        else:
            print(f"  ❌ Summary request failed with status: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"  ❌ Analysis test failed: {str(e)}")
        return False

def main():
    """Main test function"""
    print("Flask News Analysis API - Setup Test (PostgreSQL)")
    print("=" * 50)
    
    tests_passed = 0
    total_tests = 5
    
    # Test 1: PostgreSQL connection
    if test_postgresql_connection():
        tests_passed += 1
    print()
    
    # Test 2: Ollama connection
    if test_ollama_connection():
        tests_passed += 1
    print()
    
    # Test 3: Data files
    if test_data_files():
        tests_passed += 1
    print()
    
    # Test 4: Flask app
    flask_running = test_flask_app()
    if flask_running:
        tests_passed += 1
    print()
    
    # Test 5: Quick analysis (only if Flask is running)
    if flask_running:
        if run_quick_analysis_test():
            tests_passed += 1
    else:
        print("Skipping analysis test - Flask app not accessible")
    print()
    
    # Summary
    print("=" * 50)
    print(f"Tests passed: {tests_passed}/{total_tests}")
    
    if tests_passed == total_tests:
        print("🎉 All tests passed! Your setup is ready.")
        return 0
    else:
        print("⚠️  Some tests failed. Please check the issues above.")
        
        if tests_passed < 3:
            print("\nQuick Setup Guide:")
            print("1. Setup PostgreSQL:")
            print("   python3 setup_postgres.py")
            print()
            print("2. Install and start Ollama:")
            print("   curl -fsSL https://ollama.ai/install.sh | sh")
            print("   ollama pull llama3")
            print("   ollama serve")
            print()
            print("3. Start the Flask app:")
            print("   ./run.sh")
        
        return 1

if __name__ == "__main__":
    sys.exit(main())