import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface NewsNavigationProps {
  sources: string[];
  onTabSelect: (tab: string) => void;
}

const NewsNavigation = ({ sources, onTabSelect }: NewsNavigationProps) => {
  const [activeTab, setActiveTab] = useState('news');
  const tabs = ['neutral', ...sources];

  useEffect(() => {
    onTabSelect(activeTab);
  }, [activeTab]);

  return (
    <div className="px-6 py-4 border-b bg-sidebar-accent">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab(tab)}
            className={`
              rounded-full px-4 py-1 text-sm transition-all
              ${activeTab === tab
                ? 'bg-[hsl(var(--tab-active))] text-white hover:bg-[hsl(var(--tab-active)/0.9)]'
                : 'bg-transparent text-[hsl(var(--tab-inactive))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]'
              }
            `}
          >
            {tab}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default NewsNavigation;
