import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#00C49F", "#FFBB28", "#FF8042"]; // positive, neutral, negative

const SentimentPieChart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["sentiment-data"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/api/articles");
      // console.log("Fetched sentiment data:", res.data);
      return res.data;
      
    },
  });

  const chartData =
    data?.reduce(
      (acc: Record<string, number>, item: { sentiment: string }) => {
        const sentiment = item.sentiment.toLowerCase(); // normalize
        acc[sentiment] = (acc[sentiment] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ) || {};

  const pieData = Object.entries(chartData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize
    value,
  }));

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data.</p>;

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-center mb-4">Sentiment Analysis</h2>
      <div className="w-full h-[300px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SentimentPieChart;