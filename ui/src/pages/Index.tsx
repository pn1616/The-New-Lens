import { useState } from 'react';
import Header from '@/components/Header';
import SentimentBiasChart from '@/components/DashboardCharts';
import NewsSidebar from '@/components/NewsSidebar';
import MainContent from '@/components/MainContent';
import BiasPieChart from '@/components/BiasPieChart';
import DonutChart from '@/components/DonutChart';
import GroupedBarChart from '@/components/GroupedBarChart';

const Index = () => {
  const [selectedClusterId, setSelectedClusterId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex justify-center gap-6 p-6">
        <SentimentBiasChart />
        <DonutChart />
        <BiasPieChart />
        <GroupedBarChart />
      </div>
      
      <div className="flex">
        <NewsSidebar onSelectCluster={setSelectedClusterId} />
        <MainContent clusterId={selectedClusterId} />
      </div>
    </div>
  );
};

export default Index;
