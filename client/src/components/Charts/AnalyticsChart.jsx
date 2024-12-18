"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart, ResponsiveContainer } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const chartData = [
  { name: "Active Courses", value: 35, fill: "#8b5cf6" },
  { name: "Completed Courses", value: 25, fill: "#22c55e" },
  { name: "In Progress", value: 20, fill: "#eab308" },
  { name: "Pending Review", value: 15, fill: "#ef4444" },
  { name: "Draft", value: 5, fill: "#94a3b8" },
]

const AnalyticsChart = () => {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-lg font-semibold">Course Analytics</CardTitle>
        <CardDescription>Course Status Distribution</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 pb-0">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                value,
                index
              }) => {
                const RADIAN = Math.PI / 180;
                const radius = 25 + innerRadius + (outerRadius - innerRadius);
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                return (
                  <text
                    x={x}
                    y={y}
                    fill={chartData[index].fill}
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                    className="text-xs"
                  >
                    {`${chartData[index].name} (${value}%)`}
                  </text>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium text-green-600">
          <TrendingUp className="h-4 w-4" />
          Course completion rate up by 12% this month
        </div>
        <div className="text-sm text-gray-500">
          Based on current academic period
        </div>
      </CardFooter>
    </Card>
  )
}

export default AnalyticsChart 