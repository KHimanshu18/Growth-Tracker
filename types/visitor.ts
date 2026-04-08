export type UserRole = "ADMIN" | "VISITOR";

export type ExpressionOfInterest = "YES" | "NO" | "MAYBE";

export type VisitorStatus =
  | "NEW"
  | "PENDING"
  | "INTERESTED"
  | "MAYBE_LATER"
  | "JOINED"
  | "REJECTED"
  | "CATEGORY_CLASH"
  | "CLOSED";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

export type TeamMember = {
  id: number;
  name: string;
  email: string;
};

export type FollowUpSummary = {
  id: number;
  visitorId: number;
  date: Date;
  feedback: string;
  nextFollowUpDate: Date | null;
  status: VisitorStatus;
  createdAt: Date;
  by: TeamMember | null;
};

export type VisitorListItem = {
  id: number;
  name: string;
  dateOfVisit: Date;
  category: string;
  mobileNo: string;
  emailAddress: string | null;
  eoi: ExpressionOfInterest;
  invitedBy: string | null;
  categoryClash: boolean;
  status: VisitorStatus;
  assignedToId: number | null;
  createdAt: Date;
  updatedAt: Date;
  assignedTo: TeamMember | null;
  _count?: {
    followUps: number;
  };
};

export type VisitorRecord = {
  id: number;
  name: string;
  dateOfVisit: Date;
  category: string;
  mobileNo: string;
  emailAddress: string | null;
  eoi: ExpressionOfInterest;
  invitedBy: string | null;
  categoryClash: boolean;
  status: VisitorStatus;
  assignedToId: number | null;
  userId: number | null;
  createdAt: Date;
  updatedAt: Date;
  assignedTo: TeamMember | null;
  user: AuthUser | null;
  followUps: FollowUpSummary[];
};

export type CreateVisitorInput = {
  name: string;
  dateOfVisit: string;
  category: string;
  mobileNo: string;
  emailAddress?: string;
  eoi: ExpressionOfInterest;
  invitedBy?: string;
  categoryClash: boolean;
  assignedToId?: number | null;
  status: VisitorStatus;
};
