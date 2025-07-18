import React, { useState } from 'react';
import { useArticles } from '../hooks/useArticles';
import ArticleCard from '../components/ArticleCard';
import SearchBar from '../components/SearchBar';
import ClusterFilter from '../components/ClusterFilter';
import AnalysisPanel from '../components/AnalysisPanel';
import LoadingSpinner from '../components/LoadingSpinner';
import { BarChart3, FileText, TrendingUp, AlertCircle } from 'lucide-react';

const DashboardPage = () => {
  const { articles, loading, error, fetchArticles, searchArticles, getArticlesByCluster } = useArticles();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [searchActive, setSearchActive] = useState(false);

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setShowAnalysis(true);
  };

  const handleCloseAnalysis = () => {
    setShowAnalysis(false);
    setSelectedArticle(null);
  };

  const handleSearch = (query) => {
    setSearchActive(true);
    setSelectedCluster(null);
    searchArticles(query);
  };

  const handleClearSearch = () => {
    setSearchActive(false);
    setSelectedCluster(null);
    fetchArticles();
  };

  const handleClusterSelect = (clusterId) => {
    setSelectedCluster(clusterId);
    setSearchActive(false);
    if (clusterId) {
      getArticlesByCluster(clusterId);
    } else {
      fetchArticles();
    }
  };

  const getPageTitle = () => {
    if (searchActive) return 'Search Results';
    if (selectedCluster) return `Articles in ${selectedCluster}`;
    return 'All Articles';
  };

  const getStats = () => {
    if (!articles.length) return null;
    
    const totalArticles = articles.length;
    const positiveArticles = articles.filter(a => a.analysis.sentiment.score > 0.3).length;
    const negativeArticles = articles.filter(a => a.analysis.sentiment.score < -0.3).length;
    const neutralArticles = totalArticles - positiveArticles - negativeArticles;
    
    return {
      total: totalArticles,
      positive: positiveArticles,
      negative: negativeArticles,
      neutral: neutralArticles
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-800 mb-2">
            News Analysis Dashboard
          </h1>
          <p className="text-secondary-600">
            View and analyze your news articles with AI-powered insights.
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md border border-secondary-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">Total Articles</p>
                  <p className="text-2xl font-bold text-secondary-800">{stats.total}</p>
                </div>
                <FileText className="w-8 h-8 text-primary-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md border border-secondary-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">Positive</p>
                  <p className="text-2xl font-bold text-green-600">{stats.positive}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md border border-secondary-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">Negative</p>
                  <p className="text-2xl font-bold text-red-600">{stats.negative}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-red-600 transform rotate-180" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md border border-secondary-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">Neutral</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.neutral}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Search */}
              <div className="bg-white rounded-lg shadow-md border border-secondary-200 p-6">
                <h2 className="text-lg font-semibold text-secondary-800 mb-4">
                  Search Articles
                </h2>
                <SearchBar 
                  onSearch={handleSearch}
                  onClear={handleClearSearch}
                  placeholder="Search articles..."
                />
              </div>

              {/* Cluster Filter */}
              <div className="bg-white rounded-lg shadow-md border border-secondary-200 p-6">
                <ClusterFilter 
                  onClusterSelect={handleClusterSelect}
                  selectedCluster={selectedCluster}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md border border-secondary-200">
              {/* Content Header */}
              <div className="border-b border-secondary-200 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-secondary-800">
                    {getPageTitle()}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-secondary-600">
                    <BarChart3 className="w-4 h-4" />
                    <span>{articles.length} articles</span>
                  </div>
                </div>
              </div>

              {/* Articles Grid */}
              <div className="p-6">
                {loading ? (
                  <LoadingSpinner size="lg" className="py-12" />
                ) : error ? (
                  <div className="text-center py-12">
                    <div className="text-red-600 mb-4">
                      <AlertCircle className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-secondary-800 mb-2">
                      Error Loading Articles
                    </h3>
                    <p className="text-secondary-600 mb-4">{error}</p>
                    <button 
                      onClick={fetchArticles}
                      className="btn-primary"
                    >
                      Try Again
                    </button>
                  </div>
                ) : articles.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-secondary-400 mb-4">
                      <FileText className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-secondary-700 mb-2">
                      No Articles Found
                    </h3>
                    <p className="text-secondary-500">
                      {searchActive 
                        ? 'Try adjusting your search terms or clear the search to see all articles.'
                        : 'Upload some news articles to get started with analysis.'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {articles.map((article) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        onClick={handleArticleClick}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Panel Modal */}
      {showAnalysis && selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <AnalysisPanel 
              article={selectedArticle} 
              onClose={handleCloseAnalysis}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;