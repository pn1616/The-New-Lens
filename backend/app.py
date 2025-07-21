from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

OLLAMA_API = "http://localhost:11434/api/generate"

@app.route("/")
def home():
    return "Flask is running!"

@app.route("/ask", methods=["POST"])
def ask_llama():
    user_prompt = request.json.get("prompt", "")

    if not user_prompt:
        return jsonify({"error": "Prompt is missing."}), 400

    payload = {
        "model": "llama3",
        "prompt": user_prompt,
        "stream": False
    }

    try:
        ollama_response = requests.post(OLLAMA_API, json=payload)
        ollama_response.raise_for_status()
        result = ollama_response.json()
        return jsonify({"response": result.get("response", "")})

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Ollama error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
