"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import type { VisitorListItem } from "@/types";

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

export function VisitorRow({ visitor }: { visitor: VisitorListItem }) {
  const router = useRouter();

  return (
    <TableRow
      className="cursor-pointer"
      onClick={() => router.push(`/personal-details/${visitor.id}`)}
    >
      <TableCell>{visitor.id}</TableCell>
      <TableCell className="font-medium">{visitor.name}</TableCell>
      <TableCell>{visitor.category}</TableCell>
      <TableCell>
        {new Date(visitor.dateOfVisit).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <Badge variant="secondary">
          {statusLabel[visitor.status] ?? visitor.status}
        </Badge>
      </TableCell>
      <TableCell>
        {visitor.assignedTo ? visitor.assignedTo.name : "-"}
      </TableCell>
    </TableRow>
  );
}
