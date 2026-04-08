"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { DashboardStats } from "@/types";
import { useAuthContext } from "./auth-context";

type DashboardContextValue = {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refreshDashboard: () => Promise<void>;
};

const DashboardContext = createContext<DashboardContextValue | undefined>(
  undefined,
);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthContext();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshDashboard = async () => {
    if (!isAuthenticated) {
      setStats(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/dashboard/stats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load dashboard stats");
      }

      const data = (await response.json()) as { stats: DashboardStats };
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshDashboard();
  }, [isAuthenticated]);

  const value = useMemo(
    () => ({
      stats,
      loading,
      error,
      refreshDashboard,
    }),
    [stats, loading, error],
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error(
      "useDashboardContext must be used within DashboardProvider",
    );
  }
  return context;
}
