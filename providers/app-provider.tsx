"use client";

import React from "react";
import type { AuthUser } from "@/types";
import { AuthProvider } from "@/context/auth-context";
import { DashboardProvider } from "@/context/dashboard-context";
import { VisitorProvider } from "@/context/visitor-context";
import { FollowUpProvider } from "@/context/follow-up-context";

export function AppProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: AuthUser | null;
}) {
  return (
    <AuthProvider initialUser={initialUser}>
      <DashboardProvider>
        <VisitorProvider>
          <FollowUpProvider>{children}</FollowUpProvider>
        </VisitorProvider>
      </DashboardProvider>
    </AuthProvider>
  );
}
