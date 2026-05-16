"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/analyze", { cache: "no-store" })
      .then(res => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message));
  }, []);

  if (error) return <pre>Error: {error}</pre>;
  if (!data) return <pre>Loading…</pre>;

  return (
    <main style={{ padding: 40, fontFamily: "monospace" }}>
      <h2>Release Readiness (Minimal)</h2>

      <h3>Jira</h3>
      <pre>
{JSON.stringify(data.jiraMetrics, null, 2)}
      </pre>

      <h3>GitHub</h3>
      <pre>
{JSON.stringify(data.githubMetrics, null, 2)}
      </pre>

      <h3>Decision</h3>
      <pre>
{JSON.stringify(data.readiness, null, 2)}
      </pre>
    </main>
  );
}
