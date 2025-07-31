import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NewsNavigation from './NewsNavigation';

interface MainContentProps {
  clusterId: number | null;
}

const MainContent = ({ clusterId }: MainContentProps) => {
  const [selectedTab, setSelectedTab] = useState('neutral');

  const {
    data: clusterData,
    isLoading: isClusterLoading,
    error: clusterError,
  } = useQuery({
    queryKey: ['clusterDetails', clusterId],
    queryFn: () =>
      axios.get(`http://localhost:5000/api/cluster/${clusterId}`).then((res) => res.data),
    enabled: !!clusterId,
  });

  const selectedArticle = clusterData?.sources?.find(
    (src: any) => src.source === selectedTab
  );

  const {
    data: articleData,
    isLoading: isArticleLoading,
    error: articleError,
  } = useQuery({
    queryKey: ['articleDetails', selectedArticle?.article_id],
    queryFn: () =>
      axios.get(`http://localhost:5000/api/article/${selectedArticle.article_id}`).then((res) => res.data),
      
    enabled: selectedTab !== 'neutral' && !!selectedArticle?.article_id,
  });

  return (
    <div className="flex-1 p-6 flex flex-col h-screen">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-0 flex-shrink-0">
          <CardTitle className="mb-2">News Content</CardTitle>
          {clusterData && clusterData.sources && (
            <NewsNavigation
              sources={clusterData.sources.map((s: any) => s.source)}
              onTabSelect={setSelectedTab}
            />
          )}
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto text-left">
          {!clusterId ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <p className="text-lg mb-2">Select a news item to read</p>
                <p className="text-sm">
                  Click on any news item from the sidebar to view its content here.
                </p>
              </div>
            </div>
          ) : isClusterLoading ? (
            <p>Loading cluster details...</p>
          ) : clusterError ? (
            <p className="text-red-500">Error loading cluster details.</p>
          ) : selectedTab === 'neutral' ? (
            <div className="text-base whitespace-pre-line leading-relaxed">
              {clusterData.summary}
            </div>
          ) : isArticleLoading ? (
            <p>Loading article...</p>
          ) : articleError ? (
            <p className="text-red-500">Error loading article.</p>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">{articleData.title}</h3>
              <p className="text-base whitespace-pre-line leading-relaxed">
                {articleData.content}
              </p>
              <div className="text-sm space-y-1">
                <p><strong>Sentiment:</strong> {articleData.sentiment}</p>
                <p><strong>Bias:</strong> {articleData.bias}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MainContent;