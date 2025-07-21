#using google fact-check api for fact-checking

import requests
import time
import json

API_KEY = "AIzaSyCfj0Vk9SZk43vrFFEIwNL-3T-EdIfhmuI"
API_URL = "https://factchecktools.googleapis.com/v1alpha1/claims:search"

with open('bbc_full.json','r') as f:
    articles = json.load(f)

def is_factually_accurate(claim):
    params = {
        "query": claim,
        "key": API_KEY
    }
    response = requests.get(API_URL, params=params)
    print(f"\nSearching for claim: {claim}")
    print("Status Code:", response.status_code)

    data = response.json()
    claims = data.get("claims", [])

    if not claims:
        print("No fact-checks found for this claim.")
        return False

    for claim in claims:
        reviews = claim.get("claimReview", [])
        for review in reviews:
            rating = review.get("textualRating", "").lower()
            print("📋 Found rating:", rating)
            if any(keyword in rating for keyword in ["true", "accurate", "correct", "mostly true"]):
                return True

    print(" Found claims, but none confirmed accurate.")
    return False

fact_checked_articles = []

for i, article in enumerate(articles):
    print(f"Fact-checking article {i+1}/{len(articles)}")
    claim_to_check = article["title"]  
    try:
        if is_factually_accurate(claim_to_check):
            fact_checked_articles.append(article)
            print("Verified as accurate")
        else:
            print(" Not verified or potentially false")
    except Exception as e:
        print(" Error during fact-checking:", e)
    
    time.sleep(1)  


with open("bbc_factchecked.json", "w") as f:
    json.dump(fact_checked_articles, f, indent=2)

print(f"\n Done {len(fact_checked_articles)} out of {len(articles)} were fact-checked and verified.")