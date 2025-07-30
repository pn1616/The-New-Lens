import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchArticle = async (id: string) => {
  const res = await axios.get(`http://localhost:5000/api/article/${id}`);
  return res.data;
};

export default function Article() {
  const { articleId } = useParams<{ articleId: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["article", articleId],
    queryFn: () => fetchArticle(articleId!),
  });

  if (isLoading) return <div>Loading article...</div>;
  if (error) return <div>Error loading article</div>;

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.content}</p>
      <p><strong>Sentiment:</strong> {data.sentiment}</p>
      <p><strong>Bias:</strong> {data.bias}</p>
    </div>
  );
}
