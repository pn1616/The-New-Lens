# The New Lens

A full-stack AI-powered news aggregation and clustering platform. The New Lens scrapes news articles, stores them in a PostgreSQL database, and uses a local LLM (via [Ollama](https://ollama.ai)) to intelligently cluster related stories, giving you a cleaner, smarter view of the news.

---

## Project Structure

```
The-New-Lens/
├── backend/       # Flask REST API + news scraping + AI clustering
├── frontend/      # TypeScript + React + Tailwind CSS UI
└── .gitignore
```

---

## Features

- Clusters related news stories using a local LLM via Ollama
- Stores articles and clusters in a PostgreSQL database
- Fast, responsive frontend built with React and Tailwind CSS
- Backend and frontend communicate via a Flask REST API with CORS support
- News scrapers for multiple sources included (see [Current Limitations](#current-limitations-and-roadmap))

---

## Tech Stack

| Layer     | Technology                           |
|-----------|--------------------------------------|
| Frontend  | TypeScript, React, Tailwind CSS, Vite |
| Backend   | Python, Flask, Flask-CORS            |
| AI/LLM    | Ollama (local inference)             |
| Scraping  | BeautifulSoup4, httpx                |
| Database  | PostgreSQL (psycopg2)                |

---

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.10+)
- [PostgreSQL](https://www.postgresql.org/)
- [Ollama](https://ollama.ai/) (running locally)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/pn1616/The-New-Lens.git
cd The-New-Lens
```

---

### 2. Backend Setup

```bash
cd backend
```

#### Create and activate a virtual environment

```bash
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
```

#### Install dependencies

```bash
pip install beautifulsoup4 click flask flask-cors httpcore httpx ollama psycopg2 psycopg2-binary
```

#### Configure the database

Make sure PostgreSQL is running locally. Then update the database connection settings in the following files to match your local setup:

- `insert_news.py`
- `insert_cluster.py`

Example connection string:
```python
conn = psycopg2.connect(
    host="localhost",
    database="your_db_name",
    user="your_username",
    password="your_password"
)
```

#### Run the Flask server

```bash
flask run
```

The backend will start at `http://localhost:5000`.

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:5173` (or the port Vite assigns).

---

## Database Setup

Create the required tables in your PostgreSQL database before running the backend. Make sure the schema matches what's expected in `insert_news.py` and `insert_cluster.py`.

> **Tip:** If you have a `schema.sql` file, run it with:
> ```bash
> psql -U your_username -d your_db_name -f schema.sql
> ```

---

## Ollama (Local LLM)

This project uses [Ollama](https://ollama.ai/) for local AI inference to cluster news articles.

1. Install Ollama from [https://ollama.ai](https://ollama.ai)
2. Pull a model (e.g., `llama3`):
   ```bash
   ollama pull llama3
   ```
3. Make sure Ollama is running before starting the backend.

---

## Environment and Configuration

There is no `.env` file setup currently. Database credentials and settings are configured directly in the Python source files (`insert_news.py`, `insert_cluster.py`). Update these files with your local PostgreSQL connection details before running.

---

## Available Scripts

### Backend

| Command      | Description                        |
|--------------|------------------------------------|
| `flask run`  | Start the Flask development server |

### Frontend

| Command           | Description                          |
|-------------------|--------------------------------------|
| `npm run dev`     | Start the Vite development server    |
| `npm run build`   | Build for production                 |
| `npm run preview` | Preview the production build locally |

---

## Current Limitations and Roadmap

### Hardcoded Data (Current State)

At the moment, the news articles and clustering outputs displayed in the app are sourced from a **hardcoded JSON file** rather than live scraped data. This is a temporary workaround.

The scraping pipeline was built and works (`backend/scrapper/`), but the volume of scraped articles exceeded what the local Ollama LLM could process within its token limit. Feeding too many articles at once caused the clustering to fail or produce incomplete results. To keep the app functional and demonstrable, the data was hardcoded for now.

### Scraper (In Progress)

The `backend/scrapper/` folder contains scrapers for multiple news sources. These are functional but not yet wired into the main pipeline due to the token limitation mentioned above.

### Planned Improvements

- [ ] Batch processing: feed articles to Ollama in smaller chunks to work around token limits
- [ ] Integrate live scrapers from `backend/scrapper/` into the main pipeline
- [ ] Support for larger/faster Ollama models to handle more data
- [ ] Add a scheduling mechanism (e.g., cron job) to periodically refresh news

---

## Contributing

Contributions are welcome. To get started:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "Add your feature"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## License

This project does not currently specify a license. Please contact the repository owner for usage permissions.

---

## Author

**pn1616** - [GitHub Profile](https://github.com/pn1616)