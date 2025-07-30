import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchClusterDetails = async (id: string) => {
  const res = await axios.get(`http://localhost:5000/api/cluster/${id}`);
  return res.data;
};

export default function ClusterDetails() {
  const { clusterId } = useParams<{ clusterId: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["cluster", clusterId],
    queryFn: () => fetchClusterDetails(clusterId!),
  });

  if (isLoading) return <div>Loading cluster...</div>;
  if (error) return <div>Error loading cluster</div>;

  return (
    <div>
      <h2>Cluster Summary</h2>
      <p>{data.summary}</p>

      <h3>Articles</h3>
      <ul>
        {data.sources.map((article: any) => (
          <li key={article.article_id}>
            <a href={`/article/${article.article_id}`}>{article.source}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
