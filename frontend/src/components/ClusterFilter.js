import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import LoadingSpinner from './LoadingSpinner';

const ClusterFilter = ({ onClusterSelect, selectedCluster, className = '' }) => {
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const response = await api.getClusters();
        if (response.success) {
          setClusters(response.data);
        }
      } catch (error) {
        console.error('Error fetching clusters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClusters();
  }, []);

  if (loading) {
    return <LoadingSpinner size="sm" className="py-4" />;
  }

  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-semibold text-secondary-800 mb-4">Filter by Topic</h3>
      
      <div className="space-y-2">
        {/* All Articles Option */}
        <button
          onClick={() => onClusterSelect(null)}
          className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
            selectedCluster === null
              ? 'bg-primary-100 text-primary-800 border-l-4 border-primary-600'
              : 'bg-secondary-50 text-secondary-700 hover:bg-secondary-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">All Articles</span>
            <span className="text-sm bg-secondary-200 text-secondary-700 px-2 py-1 rounded-full">
              {clusters.reduce((total, cluster) => total + cluster.count, 0)}
            </span>
          </div>
        </button>

        {/* Cluster Options */}
        {clusters.map((cluster) => (
          <button
            key={cluster.id}
            onClick={() => onClusterSelect(cluster.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
              selectedCluster === cluster.id
                ? 'bg-primary-100 text-primary-800 border-l-4 border-primary-600'
                : 'bg-secondary-50 text-secondary-700 hover:bg-secondary-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cluster.color }}
                ></div>
                <span className="font-medium">{cluster.name}</span>
              </div>
              <span className="text-sm bg-secondary-200 text-secondary-700 px-2 py-1 rounded-full">
                {cluster.count}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ClusterFilter;