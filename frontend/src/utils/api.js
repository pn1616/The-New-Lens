import { mockArticles, mockClusters, mockStats } from '../data/mockData';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const api = {
  // Fetch all articles
  async getArticles() {
    await delay(800);
    return {
      success: true,
      data: mockArticles
    };
  },

  // Fetch articles by cluster
  async getArticlesByCluster(clusterId) {
    await delay(500);
    const clusterArticles = mockArticles.filter(article => article.cluster === clusterId);
    return {
      success: true,
      data: clusterArticles
    };
  },

  // Fetch single article
  async getArticle(id) {
    await delay(300);
    const article = mockArticles.find(article => article.id === parseInt(id));
    return {
      success: !!article,
      data: article
    };
  },

  // Fetch clusters
  async getClusters() {
    await delay(400);
    return {
      success: true,
      data: mockClusters
    };
  },

  // Fetch statistics
  async getStats() {
    await delay(200);
    return {
      success: true,
      data: mockStats
    };
  },

  // Analyze URL
  async analyzeUrl(url) {
    await delay(2000); // Simulate longer processing time
    
    // Mock analysis result
    const mockAnalysis = {
      id: Date.now(),
      title: "Sample Article from URL",
      source: "External Source",
      url: url,
      publishedAt: new Date().toISOString(),
      content: "This is a sample article content extracted from the provided URL. The AI analysis system has processed this content and generated comprehensive insights.",
      imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400",
      analysis: {
        sentiment: {
          score: Math.random() * 2 - 1, // Random score between -1 and 1
          label: Math.random() > 0.5 ? "Positive" : "Negative",
          confidence: 0.85 + Math.random() * 0.15
        },
        bias: {
          score: Math.random() * 0.5,
          label: "Neutral",
          confidence: 0.80 + Math.random() * 0.20,
          direction: "Balanced"
        },
        stance: {
          topic: "General Topic",
          position: "Neutral",
          confidence: 0.75 + Math.random() * 0.25
        },
        summary: "This is an AI-generated summary of the article content, highlighting the key points and main arguments presented.",
        topics: ["General", "News", "Analysis"]
      },
      cluster: "general"
    };

    return {
      success: true,
      data: mockAnalysis
    };
  },

  // Analyze uploaded file
  async analyzeFile(file) {
    await delay(2500); // Simulate file processing time
    
    const mockAnalysis = {
      id: Date.now(),
      title: `Analysis of ${file.name}`,
      source: "Uploaded File",
      url: null,
      publishedAt: new Date().toISOString(),
      content: "This is the content extracted from the uploaded file. The AI system has processed this text and generated comprehensive analytical insights.",
      imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400",
      analysis: {
        sentiment: {
          score: Math.random() * 2 - 1,
          label: Math.random() > 0.5 ? "Positive" : "Negative",
          confidence: 0.85 + Math.random() * 0.15
        },
        bias: {
          score: Math.random() * 0.5,
          label: "Neutral",
          confidence: 0.80 + Math.random() * 0.20,
          direction: "Balanced"
        },
        stance: {
          topic: "Document Analysis",
          position: "Informative",
          confidence: 0.75 + Math.random() * 0.25
        },
        summary: "AI-generated summary of the uploaded document, extracting key insights and main themes from the content.",
        topics: ["Document", "Analysis", "Upload"]
      },
      cluster: "documents"
    };

    return {
      success: true,
      data: mockAnalysis
    };
  },

  // Search articles
  async searchArticles(query) {
    await delay(600);
    
    const filteredArticles = mockArticles.filter(article => 
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.content.toLowerCase().includes(query.toLowerCase()) ||
      article.source.toLowerCase().includes(query.toLowerCase()) ||
      article.analysis.topics.some(topic => topic.toLowerCase().includes(query.toLowerCase()))
    );

    return {
      success: true,
      data: filteredArticles
    };
  }
};

// Utility functions for formatting
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getSentimentColor = (score) => {
  if (score > 0.3) return 'text-green-600';
  if (score < -0.3) return 'text-red-600';
  return 'text-yellow-600';
};

export const getBiasColor = (score) => {
  if (score < 0.2) return 'text-green-600';
  if (score < 0.4) return 'text-yellow-600';
  return 'text-red-600';
};

export const truncateText = (text, maxLength = 150) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};