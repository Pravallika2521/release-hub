"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

/* ---------- CONFIG ---------- */

const STATUS_COLORS: Record<string, string> = {
  Done: "#22c55e",
  "In Progress": "#facc15",
  "In Review": "#38bdf8",
  "To Do": "#ef4444"
};

/* ---------- COMPONENT ---------- */

export default function ReleaseDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    const res = await fetch("/api/analyze", { cache: "no-store" });
    const result = await res.json();
    setData(result);
    setLoading(false);
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return <p style={{ padding: 40 }}>Loading dashboard…</p>;
  }

  const statusCount = data.jiraIssues.reduce((acc: any, i: any) => {
    acc[i.status] = (acc[i.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(statusCount).map(status => ({
    name: status,
    value: statusCount[status]
  }));

  return (
    <main style={{ padding: 40, fontFamily: "Segoe UI, system-ui" }}>
      <h1>🚀 Release Readiness Dashboard</h1>

      <section style={heroStyle}>
        <h2>{data.readinessScore} / 100</h2>
        <p>Release readiness derived from Jira & GitHub signals</p>
      </section>

      <section style={kpiGrid}>
        <Kpi title="Total Work Items" value={data.jiraIssues.length} />
        <Kpi
          title="Completed"
          value={data.jiraIssues.filter((i: any) => i.status === "Done").length}
        />
        <Kpi
          title="Open Risk Items"
          value={data.jiraIssues.filter((i: any) => i.status !== "Done").length}
        />
        <Kpi title="Commits in Scope" value={data.commits.length} />
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
        <div style={card}>
          <h3>Jira Status Distribution</h3>
          <div style={{ height: 280 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" label>
                  {chartData.map((e, i) => (
                    <Cell key={i} fill={STATUS_COLORS[e.name]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={card}>
          <h3>Release Risk Summary</h3>
          <ul>
            <li>🚨 To Do: {statusCount["To Do"] || 0}</li>
            <li>⚠ In Progress: {statusCount["In Progress"] || 0}</li>
            <li>🔍 In Review: {statusCount["In Review"] || 0}</li>
            <li>✅ Done: {statusCount["Done"] || 0}</li>
          </ul>
        </div>
      </section>

      <section style={{ ...card, marginTop: 40 }}>
        <h3>Action Items Before Release</h3>
        {data.jiraIssues
          .filter((i: any) => i.status !== "Done")
          .map((i: any) => (
            <p key={i.key}>
              🔴 {i.key} – {i.summary} ({i.status})
            </p>
          ))}
      </section>
    </main>
  );
}

/* ---------- UI HELPERS ---------- */

function Kpi({ title, value }: any) {
  return (
    <div style={kpiCard}>
      <p style={{ color: "#666" }}>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

const heroStyle = {
  background: "#f8fafc",
  padding: 30,
  borderRadius: 14,
  marginBottom: 30
};

const kpiGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 20,
  marginBottom: 40
};

const kpiCard = {
  background: "#ffffff",
  padding: 20,
  borderRadius: 14,
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
};

const card = {
  background: "#ffffff",
  padding: 25,
  borderRadius: 14,
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
};
``
