"use client";

import { useDashboard } from "@/hooks/use-dashboard";
import { StatsCards } from "../../components/stats-cards";

export function OverviewStats() {
  const { stats, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="rounded-lg border bg-background p-6">
        Loading overview...
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-lg border bg-background p-6 text-sm text-destructive">
        {error ?? "No dashboard data available."}
      </div>
    );
  }

  return <StatsCards stats={stats} />;
}
