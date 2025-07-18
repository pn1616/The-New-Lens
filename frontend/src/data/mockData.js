// Mock data for the AI-Powered News Analysis System

export const mockArticles = [
  {
    id: 1,
    title: "Breaking: Major Tech Company Announces Revolutionary AI Breakthrough",
    source: "TechNews Daily",
    url: "https://technews.com/ai-breakthrough-2024",
    publishedAt: "2024-01-15T10:30:00Z",
    content: "In a groundbreaking announcement today, leading technology company unveiled their latest artificial intelligence system that promises to revolutionize how we interact with digital content. The new AI system demonstrates unprecedented capabilities in natural language understanding and generation, marking a significant milestone in the field of artificial intelligence research.",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400",
    analysis: {
      sentiment: {
        score: 0.8,
        label: "Positive",
        confidence: 0.92
      },
      bias: {
        score: 0.2,
        label: "Slightly Biased",
        confidence: 0.85,
        direction: "Pro-Technology"
      },
      stance: {
        topic: "AI Development",
        position: "Supportive",
        confidence: 0.88
      },
      summary: "Technology company announces major AI breakthrough with advanced natural language capabilities, representing significant progress in AI research.",
      topics: ["Artificial Intelligence", "Technology", "Innovation"]
    },
    cluster: "technology"
  },
  {
    id: 2,
    title: "Climate Summit Reaches Historic Agreement on Carbon Emissions",
    source: "Global Environmental Report",
    url: "https://envreport.com/climate-summit-agreement",
    publishedAt: "2024-01-14T15:45:00Z",
    content: "World leaders at the international climate summit have reached a historic agreement to reduce global carbon emissions by 50% within the next decade. The agreement includes binding commitments from major industrial nations and establishes a comprehensive framework for monitoring and enforcement.",
    imageUrl: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=400",
    analysis: {
      sentiment: {
        score: 0.7,
        label: "Positive",
        confidence: 0.89
      },
      bias: {
        score: 0.1,
        label: "Neutral",
        confidence: 0.91,
        direction: "Pro-Environment"
      },
      stance: {
        topic: "Climate Action",
        position: "Supportive",
        confidence: 0.94
      },
      summary: "International climate summit achieves historic agreement on 50% carbon emission reduction with binding commitments from major nations.",
      topics: ["Climate Change", "Environment", "Policy", "International Relations"]
    },
    cluster: "environment"
  },
  {
    id: 3,
    title: "Stock Market Volatility Continues Amid Economic Uncertainty",
    source: "Financial Times Business",
    url: "https://ftbusiness.com/market-volatility-2024",
    publishedAt: "2024-01-14T09:15:00Z",
    content: "Financial markets experienced significant volatility this week as investors grapple with mixed economic signals and geopolitical tensions. The uncertainty has led to increased trading volumes and heightened concerns about market stability in the coming months.",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400",
    analysis: {
      sentiment: {
        score: -0.4,
        label: "Negative",
        confidence: 0.87
      },
      bias: {
        score: 0.3,
        label: "Moderately Biased",
        confidence: 0.82,
        direction: "Market Bearish"
      },
      stance: {
        topic: "Economic Stability",
        position: "Concerned",
        confidence: 0.85
      },
      summary: "Stock markets show continued volatility due to economic uncertainty and geopolitical tensions, raising stability concerns.",
      topics: ["Finance", "Economics", "Markets", "Geopolitics"]
    },
    cluster: "finance"
  },
  {
    id: 4,
    title: "Breakthrough in Renewable Energy Storage Technology",
    source: "Science & Innovation Weekly",
    url: "https://sciweekly.com/renewable-energy-storage",
    publishedAt: "2024-01-13T14:20:00Z",
    content: "Researchers have developed a revolutionary battery technology that could solve the storage problem for renewable energy sources. The new system offers 10 times the capacity of current lithium-ion batteries while being more environmentally friendly and cost-effective.",
    imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400",
    analysis: {
      sentiment: {
        score: 0.9,
        label: "Very Positive",
        confidence: 0.95
      },
      bias: {
        score: 0.15,
        label: "Slightly Biased",
        confidence: 0.88,
        direction: "Pro-Renewable"
      },
      stance: {
        topic: "Renewable Energy",
        position: "Highly Supportive",
        confidence: 0.92
      },
      summary: "Revolutionary battery technology breakthrough offers 10x capacity improvement for renewable energy storage with environmental benefits.",
      topics: ["Renewable Energy", "Technology", "Environment", "Innovation"]
    },
    cluster: "technology"
  },
  {
    id: 5,
    title: "Healthcare System Faces Challenges with Rising Costs",
    source: "Medical Journal Today",
    url: "https://medjournal.com/healthcare-costs-2024",
    publishedAt: "2024-01-12T11:30:00Z",
    content: "Healthcare systems worldwide are struggling with rising costs and resource constraints. New data shows that medical expenses have increased by 15% over the past year, putting additional pressure on both patients and healthcare providers.",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
    analysis: {
      sentiment: {
        score: -0.6,
        label: "Negative",
        confidence: 0.91
      },
      bias: {
        score: 0.2,
        label: "Slightly Biased",
        confidence: 0.84,
        direction: "Healthcare Critical"
      },
      stance: {
        topic: "Healthcare Policy",
        position: "Critical",
        confidence: 0.89
      },
      summary: "Healthcare systems face significant challenges with 15% cost increases, creating pressure on patients and providers.",
      topics: ["Healthcare", "Economics", "Policy", "Social Issues"]
    },
    cluster: "healthcare"
  },
  {
    id: 6,
    title: "Space Exploration Mission Achieves Major Milestone",
    source: "Space Science News",
    url: "https://spacenews.com/exploration-milestone",
    publishedAt: "2024-01-11T16:45:00Z",
    content: "The latest space exploration mission has successfully completed its primary objectives, marking a significant achievement in our understanding of the outer solar system. The mission has collected unprecedented data about distant planets and their moons.",
    imageUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400",
    analysis: {
      sentiment: {
        score: 0.85,
        label: "Very Positive",
        confidence: 0.93
      },
      bias: {
        score: 0.1,
        label: "Neutral",
        confidence: 0.90,
        direction: "Pro-Science"
      },
      stance: {
        topic: "Space Exploration",
        position: "Supportive",
        confidence: 0.91
      },
      summary: "Space mission achieves major milestone with successful completion of objectives and collection of unprecedented planetary data.",
      topics: ["Space", "Science", "Exploration", "Technology"]
    },
    cluster: "science"
  }
];

export const mockClusters = [
  {
    id: "technology",
    name: "Technology & Innovation",
    color: "#3b82f6",
    count: 2,
    articles: [1, 4]
  },
  {
    id: "environment",
    name: "Environment & Climate",
    color: "#10b981",
    count: 1,
    articles: [2]
  },
  {
    id: "finance",
    name: "Finance & Economics",
    color: "#f59e0b",
    count: 1,
    articles: [3]
  },
  {
    id: "healthcare",
    name: "Healthcare",
    color: "#ef4444",
    count: 1,
    articles: [5]
  },
  {
    id: "science",
    name: "Science & Research",
    color: "#8b5cf6",
    count: 1,
    articles: [6]
  }
];

export const mockStats = {
  totalArticles: 6,
  totalClusters: 5,
  averageSentiment: 0.3,
  mostCommonTopic: "Technology",
  analysisComplete: true
};