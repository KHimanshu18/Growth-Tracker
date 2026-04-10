"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import type { VisitorListItem, VisitorRecord } from "@/types";
import { useAuthContext } from "./auth-context";
import path from "path";

type VisitorContextValue = {
  visitors: VisitorListItem[];
  currentVisitor: VisitorRecord | null;
  loading: boolean;
  error: string | null;
  refreshVisitors: () => Promise<void>;
  refreshCurrentVisitor: () => Promise<void>;
  getVisitorById: (id: string) => Promise<VisitorRecord | null>;
};

const VisitorContext = createContext<VisitorContextValue | undefined>(
  undefined,
);

export function VisitorProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();
  const pathname = usePathname();
  const [visitors, setVisitors] = useState<VisitorListItem[]>([]);
  const [currentVisitor, setCurrentVisitor] = useState<VisitorRecord | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshVisitors = async () => {
    if (user?.role !== "ADMIN") {
      setVisitors([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/visitors/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load visitors");
      }

      const data = (await response.json()) as { visitors: VisitorListItem[] };
      setVisitors(data.visitors);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const refreshCurrentVisitor = async () => {
    if (user?.role !== "VISITOR") {
      setCurrentVisitor(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/visitors/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load current visitor");
      }

      const data = (await response.json()) as { visitor: VisitorRecord };
      setCurrentVisitor(data.visitor);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const getVisitorById = async (id: string) => {
    try {
      const response = await fetch(`/api/visitors/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load visitor");
      }

      const data = (await response.json()) as { visitor: VisitorRecord };
      return data.visitor;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (user?.role === "ADMIN") {
      void refreshVisitors();
    } else if (user?.role === "VISITOR") {
      void refreshCurrentVisitor();
    } else {
      setVisitors([]);
      setCurrentVisitor(null);
      setLoading(false);
    }
  }, [user?.role, pathname]);

  const value = useMemo(
    () => ({
      visitors,
      currentVisitor,
      loading,
      error,
      refreshVisitors,
      refreshCurrentVisitor,
      getVisitorById,
    }),
    [visitors, currentVisitor, loading, error],
  );

  return (
    <VisitorContext.Provider value={value}>{children}</VisitorContext.Provider>
  );
}

export function useVisitorContext() {
  const context = useContext(VisitorContext);
  if (!context) {
    throw new Error("useVisitorContext must be used within VisitorProvider");
  }
  return context;
}
