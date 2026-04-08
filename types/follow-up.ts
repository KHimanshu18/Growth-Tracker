import type { FollowUpSummary, VisitorStatus } from "./visitor";

export type FollowUpRecord = FollowUpSummary;

export type CreateFollowUpInput = {
  visitorId: string;
  date: string;
  feedback: string;
  nextFollowUpDate?: string | null;
  status: VisitorStatus;
};
