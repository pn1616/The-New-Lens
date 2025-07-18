import React, { useState } from 'react';
import UploadSection from '../components/UploadSection';
import AnalysisPanel from '../components/AnalysisPanel';

const UploadPage = ({ onNavigate }) => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    setShowAnalysis(true);
  };

  const handleCloseAnalysis = () => {
    setShowAnalysis(false);
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-800 mb-2">
            Upload & Analyze News Content
          </h1>
          <p className="text-secondary-600">
            Upload a news article file or provide a URL to get comprehensive AI analysis.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div>
            <UploadSection onAnalysisComplete={handleAnalysisComplete} />
          </div>

          {/* Analysis Results */}
          <div>
            {showAnalysis && analysisResult ? (
              <AnalysisPanel 
                article={analysisResult} 
                onClose={handleCloseAnalysis}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-md border border-secondary-200 p-8 text-center">
                <div className="text-secondary-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-secondary-700 mb-2">
                  Analysis Results Will Appear Here
                </h3>
                <p className="text-secondary-500">
                  Upload a news article or provide a URL to see detailed AI analysis including sentiment, bias detection, and more.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-lg shadow-md border border-secondary-200 p-6">
          <h2 className="text-xl font-semibold text-secondary-800 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="btn-secondary flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Dashboard
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="btn-secondary flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m0 0V11a1 1 0 011-1h2a1 1 0 011 1v10m3 0a1 1 0 001-1V10M9 21h6" />
              </svg>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;