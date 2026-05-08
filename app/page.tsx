"use client";

import { useEffect, useState } from "react";

export default function ReleaseDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/analyze", { cache: "no-store" })
      .then(res => res.json())
      .then(result => setData(result));
  }, []);

  if (!data) {
    return <p style={{ padding: 40 }}>Loading release data…</p>;
  }

  const { jiraMetrics, githubMetrics, readiness } = data;

  return (
    <main style={{ padding: 40, fontFamily: "Segoe UI, system-ui" }}>
      <h1>Release Readiness Dashboard</h1>

      {/* ===== Release Facts ===== */}
      <section style={card}>
        <h2>Release Facts</h2>
        <ul>
          <li>Total Tickets: {jiraMetrics.totalTickets}</li>
          <li>Completed: {jiraMetrics.doneTickets}</li>
          <li>Open: {jiraMetrics.openTickets}</li>
          <li>Blocked: {jiraMetrics.blockedTickets}</li>
          <li>Completion: {jiraMetrics.completionPercent}%</li>
          <li>GitHub Commits: {githubMetrics.commitCount}</li>
        </ul>
      </section>

      {/* ===== Release Decision ===== */}
      <section style={card}>
        <h2>Release Decision</h2>
        <p>
          <strong>Status:</strong> {readiness.status}
        </p>
        <p>
          <strong>Score:</strong> {readiness.score} / 100
        </p>
        <ul>
          {readiness.reasons.map((r: string, i: number) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </section>

      {/* ===== Score Breakdown ===== */}
      <section style={card}>
        <h2>Score Breakdown</h2>
        <table width="100%" cellPadding={6}>
          <tbody>
            <tr>
              <td>Jira Completion</td>
              <td align="right">
                {Math.round(
                  (jiraMetrics.doneTickets /
                    Math.max(jiraMetrics.totalTickets, 1)) *
                    60
                )}{" "}
                / 60
              </td>
            </tr>
            <tr>
              <td>GitHub Validation</td>
              <td align="right">20 / 20</td>
            </tr>
            <tr>
              <td>Open Work Penalty</td>
              <td align="right">
                −{Math.min(jiraMetrics.openTickets * 5, 20)} / 20
              </td>
            </tr>
            <tr>
              <td>
                <strong>Final Score</strong>
              </td>
              <td align="right">
                <strong>{readiness.score} / 100</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  );
}

const card = {
  background: "#ffffff",
  padding: 20,
  borderRadius: 10,
  marginTop: 20,
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
};
