"use client";

import { useEffect, useState } from "react";

/* ---------------- TYPES ---------------- */

type JiraIssue = {
  key: string;
  summary: string;
  status: string;
  assignee?: string;
};

/* ---------------- COMPONENT ---------------- */

export default function ReleaseDashboard() {
  const [view, setView] = useState<"dashboard" | "issues">("dashboard");
  const [summary, setSummary] = useState<any>(null);
  const [issues, setIssues] = useState<JiraIssue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* -------- FETCH RELEASE SUMMARY -------- */

  async function loadDashboard() {
    setLoading(true);
    const res = await fetch("/api/analyze", { cache: "no-store" });
    const data = await res.json();
    setSummary(data);
    setLoading(false);
  }

  /* -------- FETCH ALL ISSUES -------- */

  async function openIssuesView() {
    const res = await fetch("/api/jira/issues", { cache: "no-store" });
    const data = await res.json();
    setIssues(data);
    setView("issues");
  }

  /* -------- FETCH SINGLE ISSUE -------- */

  async function openIssue(key: string) {
    const res = await fetch(`/api/jira/issue/${key}`, {
      cache: "no-store"
    });
    const data = await res.json();
    setSelectedIssue(data);
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return <p style={{ padding: 40 }}>Loading dashboard…</p>;
  }

  /* ---------------- DASHBOARD VIEW ---------------- */

  if (view === "dashboard") {
    return (
      <main style={{ padding: 40 }}>
        <h1>🚀 Release Dashboard</h1>

        <div style={{ marginBottom: 30 }}>
          <h2>{summary.readinessScore} / 100</h2>
          <p>Release readiness score</p>
        </div>

        <div style={grid}>
          <Card
            title="Total Work Items"
            value={summary.jiraIssues.length}
            onClick={openIssuesView}
          />
          <Card
            title="Completed"
            value={summary.jiraIssues.filter((i: any) => i.status === "Done").length}
          />
          <Card
            title="Open Risk Items"
            value={summary.jiraIssues.filter((i: any) => i.status !== "Done").length}
          />
          <Card title="Commits" value={summary.commits.length} />
        </div>

        <h3 style={{ marginTop: 40 }}>Action Items</h3>
        {summary.jiraIssues
          .filter((i: any) => i.status !== "Done")
          .map((i: any) => (
            <p key={i.key}>
              🔴 {i.key} – {i.summary} ({i.status})
            </p>
          ))}
      </main>
    );
  }

  /* ---------------- ISSUES VIEW ---------------- */

  return (
    <main style={{ padding: 40 }}>
      <button onClick={() => setView("dashboard")}>← Back to Dashboard</button>

      <h2 style={{ marginTop: 20 }}>📋 Work Items</h2>

      <table width="100%" cellPadding={10}>
        <thead>
          <tr>
            <th align="left">Key</th>
            <th align="left">Summary</th>
            <th align="left">Status</th>
            <th align="left">Assignee</th>
          </tr>
        </thead>
        <tbody>
          {issues.map(issue => (
            <tr
              key={issue.key}
              style={{ cursor: "pointer" }}
              onClick={() => openIssue(issue.key)}
            >
              <td>{issue.key}</td>
              <td>{issue.summary}</td>
              <td>{issue.status}</td>
              <td>{issue.assignee || "Unassigned"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ---------------- ISSUE DETAILS ---------------- */}

      {selectedIssue && (
        <div style={detailsBox}>
          <h3>{selectedIssue.key}</h3>
          <p><b>Status:</b> {selectedIssue.status}</p>
          <p><b>Summary:</b> {selectedIssue.summary}</p>
          <p><b>Assignee:</b> {selectedIssue.assignee || "Unassigned"}</p>

          <h4>Subtasks</h4>
          {selectedIssue.subtasks.length === 0 ? (
            <p>No subtasks</p>
          ) : (
            <ul>
              {selectedIssue.subtasks.map((s: any) => (
                <li key={s.key}>
                  {s.key} – {s.fields.summary}
                </li>
              ))}
            </ul>
          )}

          <h4>Attachments</h4>
          {selectedIssue.attachments.length === 0 ? (
            <p>No attachments</p>
          ) : (
            <ul>
              {selectedIssue.attachments.map((a: any) => (
                <li key={a.id}>
                  <a href={a.content} target="_blank">
                    {a.filename}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </main>
  );
}

/* ---------------- UI HELPERS ---------------- */

function Card({ title, value, onClick }: any) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: 20,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        cursor: onClick ? "pointer" : "default"
      }}
    >
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 20
};

const detailsBox = {
  marginTop: 30,
  padding: 20,
  background: "#f9fafb",
  borderRadius: 10
};
