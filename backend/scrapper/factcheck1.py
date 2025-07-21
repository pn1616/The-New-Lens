#using google fact check api

import json
import subprocess
import time

with open("bbc_full.json", "r") as f:
    articles = json.load(f)

def fact_check_with_llama(article_text):
    prompt = (
        "Analyze the following news article and label it as one of the following:\n"
        "- ACCURATE: The article is factual and trustworthy.\n"
        "- FALSE: The article contains false or misleading information.\n"
        "Just return the label. Do not explain.\n\n"
        f"{article_text}"
    )

    result = subprocess.run(
        ["ollama", "run", "llama3"],
        input=prompt,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )

    return result.stdout.strip().upper()

# List to collect verified articles
verified_articles = []

# Fact check each article
for i, article in enumerate(articles):  # remove the [:5] limit to run on all
    content = article.get("contents", "").strip()
    if not content:
        article["fact_check"] = "No content to fact-check."
        continue

    print(f"Fact-checking article {i+1}: {article['title'][:60]}...")
    try:
        verdict = fact_check_with_llama(content[:1500])
        print("LLAMA SAID:", verdict)
        article["fact_check"] = verdict

        if verdict == "ACCURATE":  
            verified_articles.append(article)

        time.sleep(3)  
    except Exception as e:
        print(f"Error: {str(e)}")
        article["fact_check"] = f"Error: {str(e)}"

with open("bbc_factchecked_filtered.json", "w") as f:
    json.dump(verified_articles, f, indent=2)

