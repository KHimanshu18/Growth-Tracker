export type DashboardPoint = {
  date: string;
  count: number;
};

export type DashboardStats = {
  totalVisitorCount: number;
  newVisitorThisMonth: number;
  followUpPending: number;
  overdueFollowUp: number;
  interestedCount: number;
  joined: number;
  rejected: number;
  categoryClash: number;
  graphData: DashboardPoint[];
};
