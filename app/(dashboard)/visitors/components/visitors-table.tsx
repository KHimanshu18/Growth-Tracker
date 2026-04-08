"use client";

import { useVisitor } from "@/hooks/use-visitor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VisitorRow } from "./visitor-row";

export function VisitorsTable() {
  const { visitors, loading, error } = useVisitor();

  if (loading) {
    return (
      <div className="rounded-lg border bg-background p-6">
        Loading visitors...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border bg-background p-6 text-sm text-destructive">
        {error}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All visitors</CardTitle>
      </CardHeader>
      <CardContent>
        {visitors.length === 0 ?
          <p className="text-sm text-muted-foreground">No visitors found.</p>
        : <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date of Visit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visitors.map((visitor) => (
                <VisitorRow key={visitor.id} visitor={visitor} />
              ))}
            </TableBody>
          </Table>
        }
      </CardContent>
    </Card>
  );
}
