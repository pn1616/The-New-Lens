#!/usr/bin/env python3
"""
Test script to verify Flask News Analysis API setup
"""

import requests
import json
import time
import sys
import os

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
    print("Flask News Analysis API - Setup Test")
    print("=" * 50)
    
    tests_passed = 0
    total_tests = 4
    
    # Test 1: Ollama connection
    if test_ollama_connection():
        tests_passed += 1
    print()
    
    # Test 2: Data files
    if test_data_files():
        tests_passed += 1
    print()
    
    # Test 3: Flask app
    flask_running = test_flask_app()
    if flask_running:
        tests_passed += 1
    print()
    
    # Test 4: Quick analysis (only if Flask is running)
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
        
        if tests_passed < 2:
            print("\nQuick Setup Guide:")
            print("1. Install and start Ollama:")
            print("   curl -fsSL https://ollama.ai/install.sh | sh")
            print("   ollama pull llama3")
            print("   ollama serve")
            print()
            print("2. Start the Flask app:")
            print("   cd backend")
            print("   python app.py")
        
        return 1

if __name__ == "__main__":
    sys.exit(main())