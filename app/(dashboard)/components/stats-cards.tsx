"use client";

import {
  AlertTriangle,
  BadgeCheck,
  CircleCheckBig,
  Clock3,
  HeartHandshake,
  Tag,
  UserRound,
  Users,
} from "lucide-react";
import type { DashboardStats } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const cards = [
  {
    key: "totalVisitorCount" as const,
    label: "Total visitor count",
    icon: Users,
  },
  {
    key: "newVisitorThisMonth" as const,
    label: "New visitor this month",
    icon: UserRound,
  },
  {
    key: "followUpPending" as const,
    label: "Follow up pending",
    icon: Clock3,
  },
  {
    key: "overdueFollowUp" as const,
    label: "Overdue follow up",
    icon: AlertTriangle,
  },
  {
    key: "interestedCount" as const,
    label: "Interested count",
    icon: HeartHandshake,
  },
  {
    key: "joined" as const,
    label: "Joined",
    icon: CircleCheckBig,
  },
  {
    key: "rejected" as const,
    label: "Rejected",
    icon: BadgeCheck,
  },
  {
    key: "categoryClash" as const,
    label: "Category clash",
    icon: Tag,
  },
];

export function StatsCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ key, label, icon: Icon }) => (
        <Card key={key}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{label}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats[key]}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
