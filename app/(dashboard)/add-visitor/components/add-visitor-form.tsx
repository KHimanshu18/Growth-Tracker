"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { addVisitorAction, type AddVisitorState } from "../actions";
import type { TeamMember } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState: AddVisitorState = {
  success: false,
  message: null,
  error: null,
};

const eoiOptions = [
  { label: "Yes", value: "YES" },
  { label: "No", value: "NO" },
  { label: "Maybe", value: "MAYBE" },
] as const;

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

export function AddVisitorForm() {
  const { user } = useAuth();
  const [state, formAction, pending] = useActionState(
    addVisitorAction,
    initialState,
  );
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [categoryClash, setCategoryClash] = useState(false);
  const [eoi, setEOI] = useState<(typeof eoiOptions)[number]["value"]>("YES");
  const [status, setStatus] =
    useState<(typeof statusOptions)[number]["value"]>("NEW");
  const [assignedToId, setAssignedToId] = useState<string>("");

  useEffect(() => {
    const loadTeamMembers = async () => {
      const response = await fetch("/api/users/team-members", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = (await response.json()) as { teamMembers: TeamMember[] };
        setTeamMembers(data.teamMembers);
      }
    };

    void loadTeamMembers();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a visitor</CardTitle>
        <CardDescription>
          Create a visitor record for the selected member.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4 md:grid-cols-2">
          <Field label="Visitor ID">
            <Input value="Auto" disabled />
          </Field>

          <Field label="Name of Visitor" required>
            <Input name="name" required />
          </Field>

          <Field label="Date of Visit" required>
            <Input name="dateOfVisit" type="date" required />
          </Field>

          <Field label="Category" required>
            <Input name="category" required />
          </Field>

          <Field label="Mobile No." required>
            <Input name="mobileNo" type="tel" required />
          </Field>

          <Field label="Email Address">
            <Input name="emailAddress" type="email" />
          </Field>

          <Field label="EOI (Expression of Interest)" required>
            <Select
              name="eoi"
              defaultValue={eoi}
              onValueChange={(value) => setEOI(value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select EOI" />
              </SelectTrigger>
              <SelectContent>
                {eoiOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Invited By">
            <Input name="invitedBy" />
          </Field>

          <div className="flex items-center gap-3 pt-7">
            <Checkbox
              id="categoryClash"
              name="categoryClash"
              checked={categoryClash}
              onCheckedChange={(checked) => setCategoryClash(Boolean(checked))}
            />
            <Label htmlFor="categoryClash">Category Clash</Label>
          </div>

          <Field label="Assigned To">
            <Select
              name="assignedToId"
              value={assignedToId}
              onValueChange={setAssignedToId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={String(member.id)}>
                    {member.name} ({member.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Overall Status" required>
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

          <Field label="Updated At">
            <Input value="Auto" disabled />
          </Field>

          <input
            type="hidden"
            name="categoryClash"
            value={categoryClash ? "on" : ""}
          />

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
              {pending ? "Saving..." : "Add visitor"}
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
