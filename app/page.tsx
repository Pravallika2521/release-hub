"use client";

import { useEffect, useState } from "react";

export default function ReleaseDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analyze", { cache: "no-store" })
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p style={{ padding: 40 }}>Loading release readiness dashboard…</p>;
  }

  const { jiraMetrics, githubMetrics, readiness, source } = data;

  return (
    <main style={{ padding: 40, fontFamily: "Segoe UI, system-ui" }}>
      {/* ================= HEADER ================= */}
      <h1>Release Readiness Dashboard</h1>
      <p style={{ color: "#555", maxWidth: 800 }}>
        This dashboard provides a high‑level release readiness view by comparing
        <b> planned work (Jira)</b> with <b>actual delivery (GitHub)</b>.
      </p>

      <p style={{ fontSize: 12, color: "#888" }}>
        Data source: {source || "node-backend"}
      </p>

      {/* ================= RELEASE FACTS ================= */}
      <section style={card}>
        <h2>Release Facts</h2>
        <ul>
          <li><b>Total Tickets:</b> {jiraMetrics.totalTickets}</li>
