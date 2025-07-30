import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const NewsSidebar = ({ onSelectCluster }: { onSelectCluster: (id: number) => void }) => {
  const { data: clusters, isLoading } = useQuery({
    queryKey: ["clusters"],
    queryFn: () => axios.get("http://localhost:5000/api/clusters").then((res) => res.data),
  });

  if (isLoading)
    return (
      <div className="w-80 bg-news-sidebar-bg border-r border-border p-4 text-muted-foreground">
        Loading clusters...
      </div>
    );

  return (
    <aside className="w-80 bg-news-sidebar-bg border-r border-border overflow-y-auto p-6 shadow-sm">
      <h2 className="text-xl font-bold text-foreground mb-5 tracking-tight">News Clusters</h2>
      <ul className="space-y-4">
        {clusters.map((cluster: any) => (
          <li
            key={cluster.id}
            onClick={() => onSelectCluster(cluster.id)}
            className="cursor-pointer"
          >
            <div className="p-4 bg-white rounded-xl border border-border shadow hover:shadow-md transition-shadow duration-200">
              <span className="line-clamp-3 text-sm text-foreground font-medium leading-snug">
                {cluster.title}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default NewsSidebar;
