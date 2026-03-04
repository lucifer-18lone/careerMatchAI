import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { SkillCoverage } from "../types";

interface RadarChartComponentProps {
  data: SkillCoverage[];
  className?: string;
}

export function RadarChartComponent({ data, className }: RadarChartComponentProps) {
  return (
    <div className={className || "w-full h-[300px]"}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="category" tick={{ fill: "#64748b", fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Student"
            dataKey="studentScore"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.4}
          />
          <Radar
            name="Required"
            dataKey="requiredScore"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.2}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: '12px' }}
            itemStyle={{ color: "#1e293b" }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
