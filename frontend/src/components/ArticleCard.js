import React from 'react';
import { Calendar, ExternalLink, User, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatDate, getSentimentColor, truncateText } from '../utils/api';

const ArticleCard = ({ article, onClick, className = '' }) => {
  const sentimentIcon = () => {
    if (article.analysis.sentiment.score > 0.3) return <TrendingUp className="w-4 h-4" />;
    if (article.analysis.sentiment.score < -0.3) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  return (
    <div 
      className={`card p-6 cursor-pointer transition-all duration-200 hover:scale-105 ${className}`}
      onClick={() => onClick(article)}
    >
      {/* Article Image */}
      {article.imageUrl && (
        <div className="mb-4">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Article Header */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-secondary-800 mb-2 line-clamp-2">
          {article.title}
        </h3>
        
        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-secondary-600 mb-2">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{article.source}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
          {article.url && (
            <ExternalLink className="w-4 h-4" />
          )}
        </div>
      </div>

      {/* Content Preview */}
      <p className="text-secondary-700 mb-4 text-sm leading-relaxed">
        {truncateText(article.content, 120)}
      </p>

      {/* Analysis Summary */}
      <div className="border-t border-secondary-200 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-secondary-700">Sentiment:</span>
            <div className={`flex items-center gap-1 ${getSentimentColor(article.analysis.sentiment.score)}`}>
              {sentimentIcon()}
              <span className="text-sm font-medium">{article.analysis.sentiment.label}</span>
            </div>
          </div>
          <div className="text-sm text-secondary-600">
            {Math.round(article.analysis.sentiment.confidence * 100)}% confident
          </div>
        </div>

        {/* Topics */}
        <div className="flex flex-wrap gap-2">
          {article.analysis.topics.slice(0, 3).map((topic, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
            >
              {topic}
            </span>
          ))}
          {article.analysis.topics.length > 3 && (
            <span className="px-2 py-1 bg-secondary-100 text-secondary-600 text-xs rounded-full">
              +{article.analysis.topics.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;