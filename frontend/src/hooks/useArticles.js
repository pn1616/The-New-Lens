import { useState, useEffect } from 'react';
import { api } from '../utils/api';

export const useArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getArticles();
      if (response.success) {
        setArticles(response.data);
      } else {
        setError('Failed to fetch articles');
      }
    } catch (err) {
      setError('Error fetching articles: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const addArticle = (newArticle) => {
    setArticles(prev => [newArticle, ...prev]);
  };

  const searchArticles = async (query) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.searchArticles(query);
      if (response.success) {
        setArticles(response.data);
      } else {
        setError('Failed to search articles');
      }
    } catch (err) {
      setError('Error searching articles: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getArticlesByCluster = async (clusterId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getArticlesByCluster(clusterId);
      if (response.success) {
        setArticles(response.data);
      } else {
        setError('Failed to fetch articles by cluster');
      }
    } catch (err) {
      setError('Error fetching articles by cluster: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return {
    articles,
    loading,
    error,
    fetchArticles,
    addArticle,
    searchArticles,
    getArticlesByCluster
  };
};

export const useArticle = (id) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.getArticle(id);
        if (response.success) {
          setArticle(response.data);
        } else {
          setError('Article not found');
        }
      } catch (err) {
        setError('Error fetching article: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  return { article, loading, error };
};