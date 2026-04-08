"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type AddVisitorState = {
  success: boolean;
  message: string | null;
  error: string | null;
};

const initialState: AddVisitorState = {
  success: false,
  message: null,
  error: null,
};

const allowedEOI = ["YES", "NO", "MAYBE"] as const;
const allowedStatus = [
  "NEW",
  "PENDING",
  "INTERESTED",
  "MAYBE_LATER",
  "JOINED",
  "REJECTED",
  "CATEGORY_CLASH",
  "CLOSED",
] as const;

export async function addVisitorAction(
  _prevState: AddVisitorState,
  formData: FormData,
): Promise<AddVisitorState> {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return { ...initialState, error: "Unauthorized." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const dateOfVisit = String(formData.get("dateOfVisit") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const mobileNo = String(formData.get("mobileNo") ?? "").trim();
  const emailAddress = String(formData.get("emailAddress") ?? "").trim();
  const eoi = String(formData.get("eoi") ?? "").trim();
  const invitedBy = String(formData.get("invitedBy") ?? "").trim();
  const categoryClash = String(formData.get("categoryClash") ?? "") === "on";
  const assignedToIdRaw = String(formData.get("assignedToId") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();

  if (!name || !dateOfVisit || !category || !mobileNo || !eoi || !status) {
    return { ...initialState, error: "Please fill all required fields." };
  }

  if (!allowedEOI.includes(eoi as (typeof allowedEOI)[number])) {
    return { ...initialState, error: "Invalid EOI value." };
  }

  if (!allowedStatus.includes(status as (typeof allowedStatus)[number])) {
    return { ...initialState, error: "Invalid status value." };
  }

  const assignedToId = assignedToIdRaw ? Number(assignedToIdRaw) : null;

  if (assignedToId && !Number.isFinite(assignedToId)) {
    return { ...initialState, error: "Invalid assigned user." };
  }

  if (assignedToId) {
    const assignedUser = await prisma.user.findUnique({
      where: { id: assignedToId },
      select: { id: true, role: true },
    });

    if (!assignedUser || assignedUser.role !== "ADMIN") {
      return {
        ...initialState,
        error: "Assigned To must be a valid team member.",
      };
    }
  }

  await prisma.visitor.create({
    data: {
      name,
      dateOfVisit: new Date(dateOfVisit),
      category,
      mobileNo,
      emailAddress: emailAddress || null,
      eoi: eoi as "YES" | "NO" | "MAYBE",
      invitedBy: invitedBy || null,
      categoryClash,
      assignedToId,
      status: status as
        | "NEW"
        | "PENDING"
        | "INTERESTED"
        | "MAYBE_LATER"
        | "JOINED"
        | "REJECTED"
        | "CATEGORY_CLASH"
        | "CLOSED",
    },
  });

  revalidatePath("/overview");
  revalidatePath("/visitors");

  return {
    success: true,
    message: "Visitor added successfully.",
    error: null,
  };
}
