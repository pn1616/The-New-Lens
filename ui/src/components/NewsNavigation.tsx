import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface NewsNavigationProps {
  sources: string[];
  onTabSelect: (tab: string) => void;
}

const NewsNavigation = ({ sources, onTabSelect }: NewsNavigationProps) => {
  // Remove duplicates using Set
  const uniqueSources = [...new Set(sources)];
  const tabs = ['neutral', ...uniqueSources];
  const [activeTab, setActiveTab] = useState(tabs[0]); // Initialize with first tab
  
  useEffect(() => {
    onTabSelect(activeTab);
    console.log(`Active tab changed to: ${activeTab}`);
  }, [activeTab, onTabSelect]);

  // Reset to first tab when sources change
  useEffect(() => {
    if (tabs.length > 0 && !tabs.includes(activeTab)) {
      setActiveTab(tabs[0]);
    }
  }, [sources]);

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