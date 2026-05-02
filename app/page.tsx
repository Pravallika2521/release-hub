"use client";

import { useEffect, useState } from "react";

export default function ReleaseDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/analyze", { cache: "no-store" })
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) {
    return <p style={{ padding: 40 }}>Loading release data…</p>;
  }

  const { jiraMetrics, githubMetrics, readiness } = data;

  return (
    <main style={{ padding: 40, fontFamily: "Segoe UI, system-ui" }}>
      {/* ================= RELEASE FACTS ================= */}
      <h1>Release Readiness Dashboard</h1>

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

      {/* ================= RELEASE DECISION ================= */}
      <section style={card}>
        <h2>
          Release Decision: {readiness.status}
        </h2>
        <p>
          Readiness Score: <b>{readiness.score} / 100</b>
        </p>
        <ul>
          {readiness.reasons.map((r: string, i: number) => (
            <li key={i}>• {r}</li>
          ))}
        </ul>
      </section>

      {/* ================= SCORE BREAKDOWN ================= */}
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
                <b>Final Score</b>
              </td>
              <td align="right">
                <b>{readiness.score} / 100</b>
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
  padding: 25,
  borderRadius: 12,
  marginTop: 25,
  boxShadow: "0 6px 16px rgba(0,0,0,0.08)"
};
``
