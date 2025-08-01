import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a28bd4"]; 

const BiasPieChart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["bias-data"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/api/articles");
      return res.data;
    },
  });

  const chartData =
    data?.reduce(
      (acc: Record<string, number>, item: { bias: string }) => {
        const bias = item.bias.toLowerCase(); 
        acc[bias] = (acc[bias] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ) || {};

  const pieData = Object.entries(chartData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1), 
    value,
  }));

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading bias data.</p>;

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-center mb-4">Bias Analysis</h2>
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

export default BiasPieChart;