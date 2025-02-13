"use client";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";

const COLORS = ["#4CAF50", "#F44336", "#FFC107"];

export function CaseOutcomesChart() {
  const [cases, setCases] = useState<any[]>([]);
  const [caseCounts, setCaseCounts] = useState({
    won: 0,
    loss: 0,
    pending: 0,
  });

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await axios.get("/api/api/getAllCases");
        if (Array.isArray(response.data.data)) {
          setCases(response.data.data);

          // Count outcomes
          const wonCases = response.data.data.filter(
            (c: any) => c.outcome.toLowerCase() === "won"
          ).length;
          const lossCases = response.data.data.filter(
            (c: any) => c.outcome.toLowerCase() === "lost"
          ).length;
          const pendingCases = response.data.data.filter(
            (c: any) => c.outcome.toLowerCase() === "pending"
          ).length;

          setCaseCounts({
            won: wonCases,
            loss: lossCases,
            pending: pendingCases,
          });
        } else {
          console.error("Expected an array but got:", response.data.data);
        }
      } catch (error: any) {
        console.error("Error fetching cases:", error.message);
      }
    };

    fetchCases();
  }, []);

  const data = [
    { name: "Wins", value: caseCounts.won },
    { name: "Losses", value: caseCounts.loss },
    { name: "Pending", value: caseCounts.pending },
  ];

  return (
    <Card className="w-screen max-w-full mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">
          Case Outcomes Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={140}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
