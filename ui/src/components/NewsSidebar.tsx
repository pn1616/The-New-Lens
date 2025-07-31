import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Calendar } from "lucide-react";

interface Cluster {
  id: number;
  title: string;
  date: string;
}

interface NewsSidebarProps {
  onSelectCluster: (id: number) => void;
}

const NewsSidebar = ({ onSelectCluster }: NewsSidebarProps) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedClusterId, setSelectedClusterId] = useState<number | null>(null); // new state

  const { data: clusters, isLoading } = useQuery({
    queryKey: ["clusters", selectedDate],
    queryFn: async () => {
      try {
        const url = selectedDate 
          ? `http://localhost:5000/api/clusters?date=${selectedDate}`
          : "http://localhost:5000/api/clusters";
        const response = await axios.get(url);
        return response.data;
      } catch (error) {
        console.error('Error fetching clusters:', error);
        return [];
      }
    },
  });

  const { data: allClusters } = useQuery({
    queryKey: ["all-clusters"],
    queryFn: async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/clusters");
        return response.data;
      } catch (error) {
        console.error('Error fetching all clusters:', error);
        return [];
      }
    },
  });

  const uniqueDates = allClusters && Array.isArray(allClusters)
    ? [...new Set(allClusters.map((cluster: Cluster) => {
        try {
          const date = new Date(cluster.date);
          if (isNaN(date.getTime())) {
            console.warn('Invalid date:', cluster.date);
            return null;
          }
          return date.toISOString().split('T')[0];
        } catch (error) {
          console.warn('Error parsing date:', cluster.date, error);
          return null;
        }
      }).filter((date): date is string => date !== null))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    : [];

  const formatDisplayDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; 
      }
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      console.warn('Error formatting date:', dateString, error);
      return dateString;
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDate(event.target.value);
    setSelectedClusterId(null); // clear selection when date filter changes
  };

  const handleClusterClick = (id: number) => {
    setSelectedClusterId(id);
    onSelectCluster(id);
  };

  if (isLoading) {
    return (
      <div className="w-80 h-screen bg-gray-50 border-r border-gray-200 p-4 text-gray-500 flex items-center justify-center">
        Loading clusters...
      </div>
    );
  }

  return (
    <aside className="w-80 h-screen bg-gray-50 border-r border-gray-200 shadow-sm flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200 bg-gray-50">
        <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">News Clusters</h2>
        
        {/* Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            <Calendar className="inline w-4 h-4 mr-1" />
            Filter by Date
          </label>
          <select
            value={selectedDate}
            onChange={handleDateChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Dates</option>
            {uniqueDates.map((date: string) => (
              <option key={date} value={date}>
                {formatDisplayDate(date)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <ul className="space-y-4">
          {clusters && Array.isArray(clusters) && clusters.length > 0 ? (
            clusters.map((cluster: Cluster) => {
              const isSelected = cluster.id === selectedClusterId;
              return (
                <li
                  key={cluster.id}
                  onClick={() => handleClusterClick(cluster.id)}
                  className="cursor-pointer"
                >
                  <div className={`p-4 rounded-xl border transition-shadow duration-200 ${
                    isSelected 
                      ? "bg-blue-50 border-blue-500 shadow-lg ring-1 ring-blue-400"
                      : "bg-white border-gray-200 shadow hover:shadow-md"
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-gray-900 font-medium leading-snug">
                        {cluster.title || 'Untitled Cluster'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {cluster.date ? formatDisplayDate(cluster.date) : 'No date'}
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <li className="text-center text-gray-500 text-sm py-8">
              {isLoading ? 'Loading...' : 'No clusters found for the selected date.'}
            </li>
          )}
        </ul>
      </div>
    </aside>
  );
};

export default NewsSidebar;
