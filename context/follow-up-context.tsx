"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { FollowUpRecord } from "@/types";

type FollowUpContextValue = {
  selectedVisitorId: number | null;
  setSelectedVisitorId: React.Dispatch<React.SetStateAction<number | null>>;
  followUps: FollowUpRecord[];
  loading: boolean;
  error: string | null;
  refreshFollowUps: (visitorId?: number | null) => Promise<void>;
};

const FollowUpContext = createContext<FollowUpContextValue | undefined>(
  undefined,
);

export function FollowUpProvider({ children }: { children: React.ReactNode }) {
  const [selectedVisitorId, setSelectedVisitorId] = useState<number | null>(
    null,
  );
  const [followUps, setFollowUps] = useState<FollowUpRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshFollowUps = async (visitorId?: number | null) => {
    const id = visitorId ?? selectedVisitorId;

    if (!id) {
      setFollowUps([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/follow-ups?visitorId=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load follow ups");
      }

      const data = (await response.json()) as { followUps: FollowUpRecord[] };
      setFollowUps(data.followUps);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshFollowUps(selectedVisitorId);
  }, [selectedVisitorId]);

  const value = useMemo(
    () => ({
      selectedVisitorId,
      setSelectedVisitorId,
      followUps,
      loading,
      error,
      refreshFollowUps,
    }),
    [selectedVisitorId, followUps, loading, error],
  );

  return (
    <FollowUpContext.Provider value={value}>
      {children}
    </FollowUpContext.Provider>
  );
}

export function useFollowUpContext() {
  const context = useContext(FollowUpContext);
  if (!context) {
    throw new Error("useFollowUpContext must be used within FollowUpProvider");
  }
  return context;
}
