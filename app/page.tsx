"use client";

import { useState } from "react";

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

  const doneIssues =
    data?.jiraIssues?.filter((i: any) => i.status === "Done").length || 0;

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
            <Card title="Done Issues" value={doneIssues} />
            <Card title="Commits" value={data.commits.length} />
          </div>

          {/* TABLES */}
          <h2 style={{ marginTop: 40 }}>📌 Jira Issues</h2>
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
        borderRadius: 8,
        minWidth: 180
      }}
    >
      <h3>{title}</h3>
      <p style={{ fontSize: 24, fontWeight: "bold" }}>{value}</p>
    </div>
  );
}
