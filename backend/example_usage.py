#!/usr/bin/env python3
"""
Example usage of the Flask News Analysis API
"""

import requests
import json
import time

# API base URL
BASE_URL = "http://localhost:5000"

def test_api_connection():
    """Test if the API is running"""
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            print("✅ API is running!")
            data = response.json()
            print(f"   Message: {data.get('message', 'N/A')}")
            return True
        else:
            print(f"❌ API returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API. Make sure Flask server is running on localhost:5000")
        return False

def run_clustering():
    """Run article clustering"""
    print("\n🔍 Running article clustering...")
    try:
        response = requests.post(f"{BASE_URL}/cluster", timeout=120)
        if response.status_code == 200:
            result = response.json()
            if result.get("success"):
                clusters = result.get("clusters", {}).get("clusters", [])
                print(f"✅ Clustering completed! Found {len(clusters)} clusters:")
                for cluster in clusters:
                    print(f"   - Cluster {cluster.get('cluster_id')}: {cluster.get('topic')}")
                    print(f"     Articles: {len(cluster.get('article_indices', []))}")
                return True
            else:
                print(f"❌ Clustering failed: {result.get('error', 'Unknown error')}")
                return False
        else:
            print(f"❌ Clustering request failed with status {response.status_code}")
            return False
    except requests.exceptions.Timeout:
        print("❌ Clustering request timed out (this can happen with large datasets)")
        return False
    except Exception as e:
        print(f"❌ Error during clustering: {str(e)}")
        return False

def run_analysis():
    """Run sentiment analysis and bias detection"""
    print("\n🧠 Running sentiment analysis and bias detection...")
    try:
        response = requests.post(f"{BASE_URL}/analyze", timeout=300)
        if response.status_code == 200:
            result = response.json()
            if result.get("success"):
                analyzed_count = result.get("analyzed_articles", 0)
                print(f"✅ Analysis completed! Analyzed {analyzed_count} articles")
                
                # Show sample results
                results = result.get("results", [])
                if results:
                    print("\n📊 Sample analysis results:")
                    for i, article in enumerate(results[:3]):  # Show first 3
                        print(f"\n   Article {i+1}: {article.get('title', 'N/A')[:60]}...")
                        sentiment = article.get('sentiment', {})
                        bias = article.get('bias', {})
                        print(f"   Sentiment: {sentiment.get('sentiment_label', 'N/A')} ({sentiment.get('sentiment_score', 'N/A')})")
                        print(f"   Bias: {bias.get('bias_type', 'N/A')} ({bias.get('bias_score', 'N/A')})")
                        print(f"   Cluster: {article.get('cluster_topic', 'N/A')}")
                return True
            else:
                print(f"❌ Analysis failed: {result.get('error', 'Unknown error')}")
                return False
        else:
            print(f"❌ Analysis request failed with status {response.status_code}")
            return False
    except requests.exceptions.Timeout:
        print("❌ Analysis request timed out (this can take a while with large datasets)")
        return False
    except Exception as e:
        print(f"❌ Error during analysis: {str(e)}")
        return False

def get_summary():
    """Get analysis summary"""
    print("\n📈 Getting analysis summary...")
    try:
        response = requests.get(f"{BASE_URL}/summary")
        if response.status_code == 200:
            result = response.json()
            stats = result.get("overall_statistics", {})
            clusters = result.get("clusters", [])
            
            print("✅ Summary retrieved!")
            print(f"\n📊 Overall Statistics:")
            print(f"   Total Articles: {stats.get('total_articles', 0)}")
            print(f"   Overall Sentiment: {stats.get('overall_sentiment', 0):.3f}")
            print(f"   Overall Bias: {stats.get('overall_bias', 0):.3f}")
            print(f"   Total Clusters: {stats.get('total_clusters', 0)}")
            
            if clusters:
                print(f"\n🏷️  Cluster Breakdown:")
                for cluster in clusters:
                    print(f"   Cluster {cluster.get('cluster_id')}: {cluster.get('topic')}")
                    print(f"     Articles: {cluster.get('article_count', 0)}")
                    print(f"     Avg Sentiment: {cluster.get('avg_sentiment', 0):.3f}")
                    print(f"     Avg Bias: {cluster.get('avg_bias', 0):.3f}")
            
            return True
        else:
            print(f"❌ Summary request failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error getting summary: {str(e)}")
        return False

def run_full_pipeline():
    """Run the complete analysis pipeline"""
    print("\n🚀 Running complete analysis pipeline...")
    try:
        response = requests.post(f"{BASE_URL}/full-analysis", timeout=600)
        if response.status_code == 200:
            result = response.json()
            if result.get("success"):
                print("✅ Full analysis pipeline completed!")
                
                # Show clustering results
                clustering = result.get("clustering", {})
                if clustering.get("success"):
                    clusters = clustering.get("clusters", {}).get("clusters", [])
                    print(f"   📊 Clustering: {len(clusters)} clusters found")
                
                # Show analysis results
                analysis = result.get("analysis", {})
                analyzed_count = analysis.get("analyzed_articles", 0)
                print(f"   🧠 Analysis: {analyzed_count} articles analyzed")
                
                # Show summary
                summary = result.get("summary", {})
                stats = summary.get("overall_statistics", {})
                print(f"   📈 Summary: {stats.get('total_articles', 0)} total articles")
                
                return True
            else:
                print(f"❌ Full analysis failed: {result.get('error', 'Unknown error')}")
                return False
        else:
            print(f"❌ Full analysis request failed with status {response.status_code}")
            return False
    except requests.exceptions.Timeout:
        print("❌ Full analysis timed out (this can take several minutes)")
        return False
    except Exception as e:
        print(f"❌ Error during full analysis: {str(e)}")
        return False

def test_ollama_query():
    """Test direct Ollama query"""
    print("\n🤖 Testing direct Ollama query...")
    try:
        response = requests.post(
            f"{BASE_URL}/ask",
            json={"prompt": "What is the capital of France?"},
            timeout=30
        )
        if response.status_code == 200:
            result = response.json()
            answer = result.get("response", "")
            print(f"✅ Ollama query successful!")
            print(f"   Q: What is the capital of France?")
            print(f"   A: {answer[:100]}...")
            return True
        else:
            print(f"❌ Ollama query failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error with Ollama query: {str(e)}")
        return False

def main():
    """Main function to run all examples"""
    print("🔬 Flask News Analysis API - Example Usage")
    print("=" * 50)
    
    # Test API connection
    if not test_api_connection():
        print("\n💡 To start the API, run: ./run.sh")
        return
    
    print("\n" + "=" * 50)
    print("Choose an option:")
    print("1. Test Ollama connection")
    print("2. Run clustering only")
    print("3. Run analysis only (requires clustering first)")
    print("4. Get summary")
    print("5. Run full pipeline (clustering + analysis + summary)")
    print("6. Run all tests")
    print("0. Exit")
    
    while True:
        try:
            choice = input("\nEnter your choice (0-6): ").strip()
            
            if choice == "0":
                print("👋 Goodbye!")
                break
            elif choice == "1":
                test_ollama_query()
            elif choice == "2":
                run_clustering()
            elif choice == "3":
                run_analysis()
            elif choice == "4":
                get_summary()
            elif choice == "5":
                run_full_pipeline()
            elif choice == "6":
                print("\n🧪 Running all tests...")
                test_ollama_query()
                time.sleep(1)
                run_clustering()
                time.sleep(2)
                run_analysis()
                time.sleep(1)
                get_summary()
                print("\n✅ All tests completed!")
            else:
                print("❌ Invalid choice. Please enter 0-6.")
                
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    main()