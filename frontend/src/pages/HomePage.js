import React from 'react';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  FileText, 
  Zap, 
  BarChart3,
  ArrowRight
} from 'lucide-react';

const HomePage = ({ onNavigate }) => {
  const features = [
    {
      icon: TrendingUp,
      title: 'Sentiment Analysis',
      description: 'Automatically detect the emotional tone and sentiment of news articles with high accuracy.',
      color: 'text-green-600'
    },
    {
      icon: AlertTriangle,
      title: 'Bias Detection',
      description: 'Identify potential bias in news reporting and understand the editorial stance.',
      color: 'text-orange-600'
    },
    {
      icon: Target,
      title: 'Stance Classification',
      description: 'Determine the position taken by articles on specific topics and issues.',
      color: 'text-purple-600'
    },
    {
      icon: FileText,
      title: 'Smart Summarization',
      description: 'Generate concise, AI-powered summaries of lengthy news articles.',
      color: 'text-blue-600'
    },
    {
      icon: BarChart3,
      title: 'Topic Clustering',
      description: 'Automatically group related articles by topic for better organization.',
      color: 'text-indigo-600'
    },
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Get instant analysis results as soon as you upload content.',
      color: 'text-yellow-600'
    }
  ];

  const stats = [
    { label: 'Articles Analyzed', value: '10,000+' },
    { label: 'Accuracy Rate', value: '95%' },
    { label: 'Processing Speed', value: '<2s' },
    { label: 'Languages Supported', value: '15+' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-primary-600 p-4 rounded-2xl">
              <Brain className="h-16 w-16 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-secondary-800 mb-6">
            AI-Powered
            <span className="text-primary-600 block">News Analysis</span>
          </h1>
          
          <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
            Unlock insights from news articles with advanced AI analysis. Detect sentiment, bias, 
            stance, and automatically cluster articles by topic for comprehensive understanding.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('upload')}
              className="btn-primary text-lg px-8 py-3 flex items-center justify-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="btn-secondary text-lg px-8 py-3 flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-5 h-5" />
              <span>View Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {stat.value}
              </div>
              <div className="text-secondary-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-800 mb-4">
            Powerful AI Analysis Features
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Our advanced AI system provides comprehensive analysis of news content 
            with industry-leading accuracy and speed.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="card p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full bg-secondary-100 ${feature.color}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-secondary-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-800 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Simple three-step process to get comprehensive AI analysis of your news content.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary-100 text-primary-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-3">
                Upload Content
              </h3>
              <p className="text-secondary-600">
                Upload a news article file or provide a URL to analyze.
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary-100 text-primary-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-3">
                AI Processing
              </h3>
              <p className="text-secondary-600">
                Our AI analyzes sentiment, bias, stance, and generates summaries.
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary-100 text-primary-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-3">
                Get Insights
              </h3>
              <p className="text-secondary-600">
                View detailed analysis results and explore clustered topics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Analyze Your News Content?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Start getting AI-powered insights from your news articles today.
          </p>
          <button
            onClick={() => onNavigate('upload')}
            className="bg-white text-primary-600 hover:bg-primary-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mx-auto"
          >
            <span>Start Analyzing</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;