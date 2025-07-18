import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle, 
  Target, 
  FileText,
  Calendar,
  User,
  ExternalLink,
  X
} from 'lucide-react';
import { formatDate, getSentimentColor, getBiasColor } from '../utils/api';

const AnalysisPanel = ({ article, onClose, className = '' }) => {
  if (!article) return null;

  const sentimentIcon = () => {
    if (article.analysis.sentiment.score > 0.3) return <TrendingUp className="w-5 h-5" />;
    if (article.analysis.sentiment.score < -0.3) return <TrendingDown className="w-5 h-5" />;
    return <Minus className="w-5 h-5" />;
  };

  const getProgressBarColor = (score) => {
    if (score > 0.3) return 'bg-green-500';
    if (score < -0.3) return 'bg-red-500';
    return 'bg-yellow-500';
  };

  const getBiasProgressColor = (score) => {
    if (score < 0.2) return 'bg-green-500';
    if (score < 0.4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`bg-white rounded-lg shadow-xl border border-secondary-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-secondary-200">
        <h2 className="text-xl font-semibold text-secondary-800">AI Analysis Results</h2>
        <button
          onClick={onClose}
          className="text-secondary-400 hover:text-secondary-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6 max-h-96 overflow-y-auto">
        {/* Article Info */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-secondary-800 mb-2">
            {article.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-secondary-600 mb-3">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{article.source}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            {article.url && (
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary-600 hover:text-primary-800"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Source</span>
              </a>
            )}
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            <h4 className="text-lg font-semibold text-secondary-800">Sentiment Analysis</h4>
          </div>
          
          <div className="bg-secondary-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`flex items-center gap-2 ${getSentimentColor(article.analysis.sentiment.score)}`}>
                {sentimentIcon()}
                <span className="font-medium">{article.analysis.sentiment.label}</span>
              </div>
              <span className="text-sm text-secondary-600">
                {Math.round(article.analysis.sentiment.confidence * 100)}% confident
              </span>
            </div>
            
            {/* Sentiment Score Bar */}
            <div className="mb-2">
              <div className="flex justify-between text-xs text-secondary-600 mb-1">
                <span>Negative</span>
                <span>Neutral</span>
                <span>Positive</span>
              </div>
              <div className="w-full bg-secondary-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressBarColor(article.analysis.sentiment.score)}`}
                  style={{ 
                    width: `${((article.analysis.sentiment.score + 1) / 2) * 100}%`,
                    minWidth: '4px'
                  }}
                ></div>
              </div>
            </div>
            
            <div className="text-sm text-secondary-600">
              Score: {article.analysis.sentiment.score.toFixed(2)} (Range: -1 to +1)
            </div>
          </div>
        </div>

        {/* Bias Detection */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h4 className="text-lg font-semibold text-secondary-800">Bias Detection</h4>
          </div>
          
          <div className="bg-secondary-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`flex items-center gap-2 ${getBiasColor(article.analysis.bias.score)}`}>
                <span className="font-medium">{article.analysis.bias.label}</span>
              </div>
              <span className="text-sm text-secondary-600">
                {Math.round(article.analysis.bias.confidence * 100)}% confident
              </span>
            </div>
            
            {/* Bias Score Bar */}
            <div className="mb-2">
              <div className="flex justify-between text-xs text-secondary-600 mb-1">
                <span>Neutral</span>
                <span>Moderate</span>
                <span>High Bias</span>
              </div>
              <div className="w-full bg-secondary-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getBiasProgressColor(article.analysis.bias.score)}`}
                  style={{ width: `${article.analysis.bias.score * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-sm text-secondary-600">
              Direction: {article.analysis.bias.direction} | Score: {article.analysis.bias.score.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Stance Classification */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-purple-600" />
            <h4 className="text-lg font-semibold text-secondary-800">Stance Classification</h4>
          </div>
          
          <div className="bg-secondary-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-medium text-secondary-800">Topic: </span>
                <span className="text-purple-600">{article.analysis.stance.topic}</span>
              </div>
              <span className="text-sm text-secondary-600">
                {Math.round(article.analysis.stance.confidence * 100)}% confident
              </span>
            </div>
            <div>
              <span className="font-medium text-secondary-800">Position: </span>
              <span className="text-purple-600">{article.analysis.stance.position}</span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <h4 className="text-lg font-semibold text-secondary-800">AI Summary</h4>
          </div>
          
          <div className="bg-secondary-50 rounded-lg p-4">
            <p className="text-secondary-700 leading-relaxed">
              {article.analysis.summary}
            </p>
          </div>
        </div>

        {/* Topics */}
        <div>
          <h4 className="text-lg font-semibold text-secondary-800 mb-3">Topics</h4>
          <div className="flex flex-wrap gap-2">
            {article.analysis.topics.map((topic, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPanel;