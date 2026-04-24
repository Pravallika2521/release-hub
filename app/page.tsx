"use client";

import { useState } from "react";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function analyze() {
    setLoading(true);
    const res = await fetch("/api/analyze");
    setData(await res.json());
    setLoading(false);
  }

  return (
    <main style={{ padding: 30 }}>
      <h1>🚀 Release Hub</h1>
      <button onClick={analyze}>
        {loading ? "Analyzing..." : "Analyze Release"}
      </button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </main>
  );
}
