"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

/* ---------------- CONFIG ---------------- */

const STATUS_COLORS: Record<string, string> = {
  Done: "#22c55e",
  "In Progress": "#facc15",
  "In Review": "#38bdf8",
  "To Do": "#ef4444"
};

const REFRESH_INTERVAL = 30000; // 30 seconds

/* ---------------- COMPONENT ---------------- */

export default function ExecutiveDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  /* ----------- DATA FETCH ----------- */
  async function analyze() {
    try {
      const res = await fetch("/api/analyze", {
        cache: "no-store"
      });
      const result = await res.json();
      setData(result);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Failed to fetch release data", err);
    } finally {
      setLoading(false);
    }
  }

  /* ----------- AUTO REFRESH (FIX 3) ----------- */
  useEffect(() => {
    analyze(); // fetch on page load

    const interval = setInterval(() => {
      analyze(); // fetch every 30 seconds
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  if (loading) {

