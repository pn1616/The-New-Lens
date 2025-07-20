import './App.css';

const sampleArticles = [
  {
    title: "Israel launches airstrike in Gaza",
    originalText: "Israeli forces launched a series of airstrikes targeting suspected Hamas militants in Gaza late Tuesday...",
    summary: "Israeli military conducted airstrikes in Gaza targeting groups believed to be linked to militant activities.",
    sentiment: "Neutral",
    bias: "Slightly Pro-Israel",
    stance: "Supports current military action",
    href: "https://www.bbc.com/news"
  },
  // add more dummy articles if needed
];

function ArticleCard({ article }) {
  return (
    <div className="card">
      <h2>{article.title}</h2>
      <p className="snippet">"{article.originalText}"</p>
      <p><strong>Neutral Summary:</strong> {article.summary}</p>
      <div className="tags">
        <span>🧠 Sentiment: {article.sentiment}</span>
        <span>⚖️ Bias: {article.bias}</span>
        <span>📌 Stance: {article.stance}</span>
      </div>
      <a href={article.href} target="_blank" rel="noopener noreferrer">🔗 Read Source</a>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <h1>📰 News Analysis Dashboard</h1>
      {sampleArticles.map((article, index) => (
        <ArticleCard key={index} article={article} />
      ))}
    </div>
  );
}

export default App;
