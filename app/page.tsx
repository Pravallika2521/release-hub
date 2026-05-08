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
        This dashboard evaluates release readiness by comparing
        <b> planned work from Jira</b> with
        <b> actual delivery from GitHub</b>.
      </p>

      <p style={{ fontSize: 12, color: "#888" }}>
        Data source: {source || "node-backend"}
      </p>

      {/* ================= RELEASE FACTS ================= */}
      <section style={card}>
        <h2>Release Facts</h2>
        <ul>
          <li><b>Total Tickets:</b> {jiraMetrics.totalTickets}</li>
          <li><b>Completed:</b> {jiraMetrics.doneTickets}</li>
          <li><b>Open:</b> {jiraMetrics.openTickets}</li>
          <li><b>Blocked:</b> {jiraMetrics.blockedTickets}</li>
          <li><b>Completion:</b> {jiraMetrics.completionPercent}%</li>
          <li><b>GitHub Commits:</b> {githubMetrics.commitCount}</li>
        </ul>
      </section>

      {/* ================= RELEASE DECISION ================= */}
      <section style={card}>
        <h2>Release Decision</h2>
        <p style={{ fontSize: 20 }}>
          <b>Status:</b>{" "}
          {readiness.status === "READY"
            ? "✅ READY"
            : readiness.status === "AT_RISK"
            ? "⚠ AT RISK"
            : "🚨 NOT READY"}
        </p>

        <p>
          <b>Readiness Score:</b> {readiness.score} / 100
        </p>

