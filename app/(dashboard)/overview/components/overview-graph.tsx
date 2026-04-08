"use client";

import { useDashboard } from "@/hooks/use-dashboard";
import { VisitorGraph } from "../../components/visitor-graph";

export function OverviewGraph() {
  const { stats, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="rounded-lg border bg-background p-6">
        Loading graph...
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-lg border bg-background p-6 text-sm text-destructive">
        {error ?? "No graph data available."}
      </div>
    );
  }

  return <VisitorGraph data={stats.graphData} />;
}
