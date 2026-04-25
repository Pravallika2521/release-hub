"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#22c55e", "#facc15", "#f97316", "#ef4444"];

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function analyzeRelease() {
    setLoading(true);
    const res = await fetch("/api/analyze");
    const result = await res.json();
    setData(result);
    setLoading(false);
  }

  const statusCounts =
    data?.jiraIssues.reduce((acc: any, issue: any) => {
      acc[issue.status] = (acc[issue.status] || 0) + 1;
      return acc;
    }, {}) || {};

  const chartData = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status]
  }));

  return (
    <main style={{ padding: 30, fontFamily: "system-ui" }}>
      <h1>🚀 Release Hub Dashboard</h1>

      <button onClick={analyzeRelease} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Release"}
      </button>

      {data && (
        <>
          {/* KPI CARDS */}
          <div style={{ display: "flex", gap: 20, marginTop: 30 }}>
            <Card title="Readiness Score" value={`${data.readinessScore} / 100`} />
            <Card title="Total Jira Issues" value={data.jiraIssues.length} />
            <Card
              title="Done Issues"
              value={data.jiraIssues.filter((i: any) => i.status === "Done").length}
            />
            <Card title="Commits" value={data.commits.length} />
          </div>

          {/* CHARTS */}
          <div style={{ display: "flex", gap: 40, marginTop: 50 }}>
            <div style={{ width: "50%", height: 300 }}>
              <h3>📊 Jira Status Distribution</h3>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {chartData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ width: "50%", height: 300 }}>
              <h3>📈 Jira Issues by Status</h3>
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#38bdf8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TABLE */}
          <h2 style={{ marginTop: 50 }}>📌 Jira Issues</h2>
          <table border={1} cellPadding={8}>
            <thead>
              <tr>
                <th>Key</th>
                <th>Summary</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.jiraIssues.map((issue: any) => (
                <tr key={issue.key}>
                  <td>{issue.key}</td>
                  <td>{issue.summary}</td>
                  <td>{issue.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 style={{ marginTop: 40 }}>💻 GitHub Commits</h2>
          <ul>
            {data.commits.map((c: any, i: number) => (
              <li key={i}>
                {c.message} — {c.author}
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}

function Card({ title, value }: { title: string; value: any }) {
  return (
    <div
      style={{
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 10,
        minWidth: 200
      }}
    >
      <h3>{title}</h3>
      <p style={{ fontSize: 26, fontWeight: "bold" }}>{value}</p>
    </div>
  );
}
