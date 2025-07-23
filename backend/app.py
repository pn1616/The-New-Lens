from flask import Flask, request, jsonify
import requests
import json
import sqlite3
import os
from datetime import datetime
import logging
from typing import List, Dict, Any

app = Flask(__name__)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

OLLAMA_API_URL = "http://localhost:11434/api/generate"
DATABASE_PATH = "news.db"

