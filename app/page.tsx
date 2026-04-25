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

const REFRESH_INTERVAL = 30000;

/* ---------- COMPONENT ---------- */

export default function ExecutiveDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  async function analyze() {
    const res = await fetch("/api/analyze", {
      cache: "no-store"
    });
    const result = await res.json();
    setData(result);
    setLastUpdated(new Date().toLocaleTimeString());
    setLoading(false);
  }

  /* ✅ FIX 3: Auto refresh */
  useEffect(() => {
    analyze();

    const interval = setInterval(() => {
      analyze();
    }, REFRESH_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return <p style={{ padding: 40 }}>Loading Release Dashboard…</p>;
  }

  /* ---------- DERIVED DATA ---------- */

  const statusCount = data.jiraIssues.reduce((acc: any, i: any) => {
    acc[i.status] = (acc[i.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(statusCount).map(status => ({
    name: status,
    value: statusCount[status]
  }));

  const openIssues =
    (statusCount["To Do"] || 0) +
    (statusCount["In Progress"] || 0) +
    (statusCount["In Review"] || 0);

  const readinessLabel =
    data.readinessScore >= 70
      ? "✅ READY FOR RELEASE"
      : data.readinessScore >= 40
      ? "⚠ RELEASE AT RISK"
      : "🚨 DO NOT RELEASE";

  /* ---------- UI ---------- */

  return (
    <main style={{ padding: 40, fontFamily: "Segoe UI, system-ui" }}>
      <h1>🚀 Release Readiness Dashboard</h1>
      <p style={{ color: "#555" }}>
        Last updated at: <strong>{lastUpdated}</strong>
      </p>

      {/* HERO */}
      <section style={heroStyle}>
        <h2>{readinessLabel}</h2>
        <p style={{ fontSize: 44, fontWeight: 700 }}>
          {data.readinessScore} / 100
        </p>
        <p style={{ color: "#666" }}>
          Release readiness derived from Jira & GitHub signals
        </p>
      </section>

      {/* KPI CARDS */}
      <section style={kpiGrid}>
        <Kpi title="Total Work Items" value={data.jiraIssues.length} />
        <Kpi title="Completed" value={statusCount["Done"] || 0} />
        <Kpi title="Open Risk Items" value={openIssues} />
        <Kpi title="Commits in Scope" value={data.commits.length} />
      </section>

      {/* ANALYTICS */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 30
        }}
      >
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

      {/* ACTION ITEMS */}
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

/* ---------- HELPERS ---------- */

function Kpi({ title, value }: any) {
  return (
    <div style={kpiCard}>
      <p style={{ color: "#666" }}>{title}</p>
      <p style={{ fontSize: 28, fontWeight: 700 }}>{value}</p>
    </div>
  );
}

/* ---------- STYLES ---------- */

const heroStyle = {
  background: "#f8fafc",
  padding: 30,
  borderRadius: 14,
  marginTop: 20
};

const kpiGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 20,
  marginTop: 30
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
