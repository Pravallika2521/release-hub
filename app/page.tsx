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

        <h4>Why?</h4>
        <ul>
          {readiness.reasons.map((reason: string, i: number) => (
            <li key={i}>{reason}</li>
          ))}
        </ul>
      </section>

      {/* ================= SCORE BREAKDOWN ================= */}
      <section style={card}>
        <h2>Score Breakdown</h2>

        <table width="100%" cellPadding={8}>
          <tbody>
            <tr>
              <td>Jira Completion</td>
              <td align="right">
                {Math.round(
                  (jiraMetrics.doneTickets /
