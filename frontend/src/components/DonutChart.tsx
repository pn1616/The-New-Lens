import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type SourceData = {
  source: string;
  count: number;
};

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#a28bd4",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
];

const DonutChart = () => {
  const {
    data: sourceRaw,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["source-distribution"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/api/source-distribution");
      return res.data as SourceData[];
    },
  });

  if (isLoading) return <p>Loading chart...</p>;
  if (error) return <p>Error loading chart data.</p>;

  const total = sourceRaw.reduce((sum, item) => sum + item.count, 0);

  const donutData = sourceRaw.map((item, index) => ({
    name: item.source,
    value: parseFloat(((item.count / total) * 100).toFixed(1)),
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-center mb-4">Source Distribution</h2>
      <ResponsiveContainer width={250} height={250}>
        <PieChart>
          <Pie
            data={donutData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            dataKey="value"
          >
            {donutData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 flex flex-col items-center gap-1 text-xs">
        {donutData.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span>
              {item.name}: {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;