import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchClusters = async () => {
  const res = await axios.get("http://localhost:5000/api/clusters");
  return res.data;
};

export default function ClusterList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["clusters"],
    queryFn: fetchClusters,
  });

  if (isLoading) return <div>Loading clusters...</div>;
  if (error) return <div>Error loading clusters</div>;

  return (
    <div>
      <h1>News</h1>
      <ul>
        {data.map((cluster: any) => (
          <li key={cluster.id}>
            <a href={`/cluster/${cluster.id}`}>
              {cluster.title} ({cluster.date})
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
