import { prisma } from "./prisma";
import type { DashboardStats } from "@/types";

const status = {
  PENDING: "PENDING",
  OVERDUE: "OVERDUE",
  INTERESTED: "INTERESTED",
  JOINED: "JOINED",
  REJECTED: "REJECTED",
  CATEGORY_CLASH: "CATEGORY_CLASH",
} as const;

function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfDay(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 29);

  const [
    totalVisitorCount,
    newVisitorThisMonth,
    followUpPending,
    overdueFollowUp,
    interestedCount,
    joined,
    rejected,
    categoryClashStatusCount,
    recentVisitors,
  ] = await Promise.all([
    prisma.visitor.count(),
    prisma.visitor.count({
      where: {
        createdAt: {
          gte: monthStart,
        },
      },
    }),
    prisma.visitor.count({
      where: {
        status: status.PENDING,
      },
    }),
    prisma.visitor.count({
      where: {
        status: status.OVERDUE,
      },
    }),
    prisma.visitor.count({
      where: {
        status: status.INTERESTED,
      },
    }),
    prisma.visitor.count({
      where: {
        status: status.JOINED,
      },
    }),
    prisma.visitor.count({
      where: {
        status: status.REJECTED,
      },
    }),
    prisma.visitor.count({
      where: {
        status: status.CATEGORY_CLASH,
      },
    }),
    prisma.visitor.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
  ]);

  const graphMap = new Map<string, number>();

  for (let i = 0; i < 30; i += 1) {
    const date = new Date(thirtyDaysAgo);
    date.setDate(thirtyDaysAgo.getDate() + i);
    graphMap.set(date.toISOString().slice(0, 10), 0);
  }

  for (const visitor of recentVisitors) {
    const key = startOfDay(visitor.createdAt).toISOString().slice(0, 10);
    graphMap.set(key, (graphMap.get(key) ?? 0) + 1);
  }

  return {
    totalVisitorCount,
    newVisitorThisMonth,
    followUpPending,
    overdueFollowUp,
    interestedCount,
    joined,
    rejected,
    categoryClash: categoryClashStatusCount,
    graphData: Array.from(graphMap.entries()).map(([date, count]) => ({
      date,
      count,
    })),
  };
}
