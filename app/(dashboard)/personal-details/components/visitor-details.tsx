"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VisitorRecord } from "@/types";
import { useVisitor } from "@/hooks/use-visitor";

const statusLabel: Record<string, string> = {
  NEW: "New",
  PENDING: "Pending",
  INTERESTED: "Interested",
  MAYBE_LATER: "Maybe Later",
  JOINED: "Joined",
  REJECTED: "Rejected",
  CATEGORY_CLASH: "Category Clash",
  CLOSED: "Closed",
};

const eoiLabel: Record<string, string> = {
  YES: "Yes",
  NO: "No",
  MAYBE: "Maybe",
};

export function VisitorDetails({ visitorId }: { visitorId?: number }) {
  const { currentVisitor, getVisitorById } = useVisitor();
  const [visitor, setVisitor] = useState<VisitorRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      if (visitorId) {
        const data = await getVisitorById(visitorId);
        setVisitor(data);
      } else {
        setVisitor(currentVisitor);
      }

      setLoading(false);
    };

    void load();
  }, [visitorId, currentVisitor]);

  if (loading) {
    return (
      <div className="rounded-lg border bg-background p-6">
        Loading visitor details...
      </div>
    );
  }

  if (!visitor) {
    return (
      <div className="rounded-lg border bg-background p-6 text-sm text-muted-foreground">
        No visitor details found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{visitor.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Detail label="Visitor ID" value={String(visitor.id)} />
          <Detail
            label="Date of Visit"
            value={new Date(visitor.dateOfVisit).toLocaleDateString()}
          />
          <Detail label="Category" value={visitor.category} />
          <Detail label="Mobile No." value={visitor.mobileNo} />
          <Detail label="Email Address" value={visitor.emailAddress ?? "-"} />
          <Detail label="EOI" value={eoiLabel[visitor.eoi] ?? visitor.eoi} />
          <Detail label="Invited By" value={visitor.invitedBy ?? "-"} />
          <Detail
            label="Category Clash"
            value={visitor.categoryClash ? "Yes" : "No"}
          />
          <Detail
            label="Assigned To"
            value={
              visitor.assignedTo ?
                `${visitor.assignedTo.name} (${visitor.assignedTo.email})`
              : "-"
            }
          />
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Overall Status</div>
            <Badge variant="secondary">
              {statusLabel[visitor.status] ?? visitor.status}
            </Badge>
          </div>
          <Detail
            label="Created At"
            value={new Date(visitor.createdAt).toLocaleString()}
          />
          <Detail
            label="Updated At"
            value={new Date(visitor.updatedAt).toLocaleString()}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Follow ups</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {visitor.followUps.length === 0 ?
            <p className="text-sm text-muted-foreground">No follow ups yet.</p>
          : visitor.followUps.map((followUp) => (
              <div key={followUp.id} className="rounded-md border p-3">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <Badge variant="outline">
                    {statusLabel[followUp.status] ?? followUp.status}
                  </Badge>
                  <span>{new Date(followUp.date).toLocaleDateString()}</span>
                  <span className="text-muted-foreground">
                    by {followUp.by ? followUp.by.name : "Unknown"}
                  </span>
                </div>
                <p className="mt-2 text-sm">{followUp.feedback}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Next follow up:{" "}
                  {followUp.nextFollowUpDate ?
                    new Date(followUp.nextFollowUpDate).toLocaleDateString()
                  : "-"}
                </p>
              </div>
            ))
          }
        </CardContent>
      </Card>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}
