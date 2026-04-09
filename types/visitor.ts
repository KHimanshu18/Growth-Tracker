export type UserRole = "ADMIN" | "VISITOR";

export type ExpressionOfInterest = "YES" | "NO" | "MAYBE";

export type VisitorStatus =
  | "NEW"
  | "PENDING"
  | "OVERDUE"
  | "INTERESTED"
  | "MAYBE_LATER"
  | "JOINED"
  | "REJECTED"
  | "CATEGORY_CLASH"
  | "CLOSED";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
};

export type FollowUpSummary = {
  id: string;
  visitorId: string;
  date: Date;
  feedback: string;
  nextFollowUpDate: Date | null;
  status: VisitorStatus;
  createdAt: Date;
  by: TeamMember | null;
};

export type VisitorListItem = {
  id: string;
  name: string;
  dateOfVisit: Date;
  category: string;
  mobileNo: string;
  emailAddress: string | null;
  eoi: ExpressionOfInterest;
  invitedBy: string | null;
  categoryClash: boolean;
  status: VisitorStatus;
  assignedToId: string | null;
  createdAt: Date;
  updatedAt: Date;
  assignedTo: TeamMember | null;
  _count?: {
    followUps: number;
  };
};

export type VisitorRecord = {
  id: string;
  name: string;
  dateOfVisit: Date;
  category: string;
  mobileNo: string;
  emailAddress: string | null;
  eoi: ExpressionOfInterest;
  invitedBy: string | null;
  categoryClash: boolean;
  status: VisitorStatus;
  assignedToId: string | null;
  userId: string | null;
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
  assignedToId?: string | null;
  status: VisitorStatus;
};
