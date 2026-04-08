"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVisitor } from "@/hooks/use-visitor";
import { useFollowUp } from "@/hooks/use-follow-up";

export function VisitorSelect() {
  const { visitors } = useVisitor();
  const { selectedVisitorId, setSelectedVisitorId } = useFollowUp();

  return (
    <Select
      value={selectedVisitorId ? String(selectedVisitorId) : ""}
      onValueChange={(value) => setSelectedVisitorId(value || null)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select visitor" />
      </SelectTrigger>
      <SelectContent>
        {visitors.map((visitor) => (
          <SelectItem key={visitor.id} value={String(visitor.id)}>
            {visitor.name} ({visitor.mobileNo})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
