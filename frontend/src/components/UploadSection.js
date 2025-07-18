import React, { useState } from 'react';
import { Upload, Link, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { api } from '../utils/api';
import LoadingSpinner from './LoadingSpinner';

const UploadSection = ({ onAnalysisComplete, className = '' }) => {
  const [activeTab, setActiveTab] = useState('url');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.analyzeUrl(url);
      if (response.success) {
        setSuccess('Article analyzed successfully!');
        onAnalysisComplete(response.data);
        setUrl('');
      } else {
        setError('Failed to analyze the URL. Please try again.');
      }
    } catch (err) {
      setError('Error analyzing URL: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    const allowedTypes = ['text/plain', 'application/pdf', 'text/html', 'application/json'];
    if (!allowedTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.txt')) {
      setError('Please upload a valid text file (txt, pdf, html, json)');
      return;
    }

    // Validate file size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
    setError('');
    setSuccess('');
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.analyzeFile(file);
      if (response.success) {
        setSuccess('File analyzed successfully!');
        onAnalysisComplete(response.data);
        setFile(null);
        // Reset file input
        const fileInput = document.getElementById('file-upload');
        if (fileInput) fileInput.value = '';
      } else {
        setError('Failed to analyze the file. Please try again.');
      }
    } catch (err) {
      setError('Error analyzing file: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md border border-secondary-200 ${className}`}>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-secondary-800 mb-2">
          Add News Content for Analysis
        </h2>
        <p className="text-secondary-600 mb-6">
          Upload a news article file or provide a URL to get AI-powered analysis including sentiment, bias detection, and topic clustering.
        </p>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-secondary-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'url'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-secondary-600 hover:text-secondary-800'
            }`}
          >
            <Link className="w-4 h-4" />
            <span>URL</span>
          </button>
          <button
            onClick={() => setActiveTab('file')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'file'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-secondary-600 hover:text-secondary-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>File Upload</span>
          </button>
        </div>

        {/* URL Tab */}
        {activeTab === 'url' && (
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-secondary-700 mb-2">
                News Article URL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/news-article"
                className="input-field"
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Link className="w-4 h-4" />
                  <span>Analyze URL</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* File Upload Tab */}
        {activeTab === 'file' && (
          <form onSubmit={handleFileSubmit} className="space-y-4">
            <div>
              <label htmlFor="file-upload" className="block text-sm font-medium text-secondary-700 mb-2">
                Upload News Article File
              </label>
              <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-sm text-secondary-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-secondary-500">
                    Supported formats: TXT, PDF, HTML, JSON (Max 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileUpload}
                  accept=".txt,.pdf,.html,.json,text/plain,application/pdf,text/html,application/json"
                  className="hidden"
                  disabled={loading}
                />
                <label
                  htmlFor="file-upload"
                  className="btn-secondary mt-4 cursor-pointer inline-flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose File</span>
                </label>
              </div>
              {file && (
                <div className="mt-2 p-3 bg-secondary-50 rounded-md">
                  <p className="text-sm text-secondary-700">
                    Selected: {file.name} ({Math.round(file.size / 1024)}KB)
                  </p>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !file}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Analyze File</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Status Messages */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSection;