"use client";

import { useEffect, useState } from "react";

/* ---------------- COMPONENT ---------------- */

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
    return <p style={{ padding: 40 }}>Loading release readiness…</p>;
  }

  const readinessStatus =
    data.readinessStatus || "AT_RISK";

  return (
    <main style={{ padding: 40, fontFamily: "Segoe UI, system-ui" }}>
      {/* ================= HEADER ================= */}
      <h1>Release Readiness Overview</h1>
      <p style={{ color: "#555", maxWidth: 800 }}>
        This dashboard evaluates whether the current release is safe to deploy
        by comparing <b>planned work</b> from Jira with <b>actual code changes</b>
        from GitHub.
      </p>

      {/* ================= SCORE CARD ================= */}
      <section style={card}>
        <h2>
          Score: {data.readinessScore} / 100 —{" "}
          {readinessStatus === "READY"
            ? "✅ READY"
            : readinessStatus === "AT_RISK"
            ? "⚠ AT RISK"
            : "🚨 NOT READY"}
        </h2>

        <p style={{ color: "#555" }}>
          The readiness score summarizes delivery completion, code validation,
          and release risk signals.
        </p>
      </section>

      {/* ================= WHY THIS SCORE ================= */}
      <section style={card}>
        <h3>Why is this the Readiness Score?</h3>
        <ul>
          <li>
            {data.metrics?.jira?.openIssues > 0
              ? `${data.metrics.jira.openIssues} planned work items are still open`
              : "All planned Jira work items are completed ✅"}
          </li>
          <li>
            {data.metrics?.jira?.blockerIssues > 0
              ? "Blocker tickets are present 🚨"
              : "No blocker Jira tickets detected ✅"}
          </li>
          <li>
            {data.metrics?.github?.totalCommits > 0
              ? "Code changes were detected in GitHub ✅"
              : "No code changes detected 🚨"}
          </li>
        </ul>
      </section>

      {/* ================= SCORE BREAKDOWN ================= */}
      <section style={card}>
        <h3>How the Readiness Score Was Calculated</h3>

        <table width="100%" cellPadding={8}>
          <tbody>
            <tr>
              <td>Jira Completion Contribution</td>
              <td align="right">
                {Math.round(
                  (data.metrics?.jira?.completionRatio || 0) * 60
                )}{" "}
                / 60
              </td>
            </tr>
            <tr>
              <td>GitHub Activity Validation</td>
              <td align="right">
                {data.metrics?.github?.totalCommits > 0 ? "20 / 20" : "0 / 20"}
              </td>
            </tr>
            <tr>
              <td>Open Work Risk Penalty</td>
              <td align="right">
                −
                {Math.min(
                  (data.metrics?.jira?.openIssues || 0) * 5,
                  20
                )}{" "}
                / 20
              </td>
            </tr>
            <tr>
              <td>
                <b>Final Readiness Score</b>
              </td>
              <td align="right">
                <b>{data.readinessScore} / 100</b>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ================= RELEASE GATES ================= */}
      <section style={card}>
        <h3>Release Gates Status</h3>

        <h4>Mandatory Gates (must pass)</h4>
        <ul>
          {data.failedGates && data.failedGates.length > 0 ? (
            data.failedGates.map((g: string, i: number) => (
              <li key={i}>🚨 {g}</li>
            ))
          ) : (
            <>
              <li>✅ No blocker Jira tickets</li>
              <li>✅ Code changes present</li>
            </>
          )}
        </ul>

        <h4>Advisory Risk Signals</h4>
        <ul>
