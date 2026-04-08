"use client";

import { useActionState, useEffect, useState } from "react";
import { addFollowUpAction, type FollowUpState } from "../actions";
import { useAuth } from "@/hooks/use-auth";
import { useFollowUp } from "@/hooks/use-follow-up";
import { useVisitor } from "@/hooks/use-visitor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState: FollowUpState = {
  success: false,
  message: null,
  error: null,
};

const statusOptions = [
  { label: "New", value: "NEW" },
  { label: "Pending", value: "PENDING" },
  { label: "Interested", value: "INTERESTED" },
  { label: "Maybe Later", value: "MAYBE_LATER" },
  { label: "Joined", value: "JOINED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Category Clash", value: "CATEGORY_CLASH" },
  { label: "Closed", value: "CLOSED" },
] as const;

export function FollowUpForm() {
  const { user } = useAuth();
  const { visitors } = useVisitor();
  const { selectedVisitorId, setSelectedVisitorId } = useFollowUp();
  const [state, formAction, pending] = useActionState(
    addFollowUpAction,
    initialState,
  );
  const [status, setStatus] =
    useState<(typeof statusOptions)[number]["value"]>("PENDING");
  const [visitorId, setVisitorId] = useState<string>(
    selectedVisitorId ? String(selectedVisitorId) : "",
  );

  useEffect(() => {
    setVisitorId(selectedVisitorId ? String(selectedVisitorId) : "");
  }, [selectedVisitorId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add follow up</CardTitle>
        <CardDescription>
          Select a visitor and save the follow up details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4 md:grid-cols-2">
          <input type="hidden" name="visitorId" value={visitorId} />

          <Field label="Visitor" required>
            <Select
              value={visitorId}
              onValueChange={(value) => {
                setVisitorId(value);
                setSelectedVisitorId(value ? Number(value) : null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select visitor" />
              </SelectTrigger>
              <SelectContent>
                {visitors.map((visitor) => (
                  <SelectItem key={visitor.id} value={String(visitor.id)}>
                    {visitor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="By">
            <Input value={user?.name ?? "Unknown"} disabled />
          </Field>

          <Field label="Date" required>
            <Input name="date" type="date" required />
          </Field>

          <Field label="Feedback" required>
            <Input name="feedback" required />
          </Field>

          <Field label="Next Follow-up Date">
            <Input name="nextFollowUpDate" type="date" />
          </Field>

          <Field label="Status" required>
            <Select
              name="status"
              defaultValue={status}
              onValueChange={(value) => setStatus(value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Created At">
            <Input value="Auto" disabled />
          </Field>

          {state.error ?
            <p className="md:col-span-2 text-sm text-destructive">
              {state.error}
            </p>
          : null}

          {state.message ?
            <p className="md:col-span-2 text-sm text-emerald-600">
              {state.message}
            </p>
          : null}

          <div className="md:col-span-2">
            <Button type="submit" disabled={pending || user?.role !== "ADMIN"}>
              {pending ? "Saving..." : "Save follow up"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label>
        {label}{" "}
        {required ?
          <span className="text-destructive">*</span>
        : null}
      </Label>
      {children}
    </div>
  );
}
