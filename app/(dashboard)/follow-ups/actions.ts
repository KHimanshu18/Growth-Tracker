"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type FollowUpState = {
  success: boolean;
  message: string | null;
  error: string | null;
};

const initialState: FollowUpState = {
  success: false,
  message: null,
  error: null,
};

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

export async function addFollowUpAction(
  _prevState: FollowUpState,
  formData: FormData,
): Promise<FollowUpState> {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return { ...initialState, error: "Unauthorized." };
  }

  // ✅ UUID handling
  const visitorIdRaw = String(formData.get("visitorId") ?? "").trim();
  const visitorId =
    visitorIdRaw && visitorIdRaw !== "none" ? visitorIdRaw : null;

  const date = String(formData.get("date") ?? "").trim();
  const feedback = String(formData.get("feedback") ?? "").trim();
  const nextFollowUpDate = String(
    formData.get("nextFollowUpDate") ?? "",
  ).trim();
  const status = String(formData.get("status") ?? "").trim();

  // ✅ Updated validation (no Number checks)
  if (!visitorId || !date || !feedback || !status) {
    return { ...initialState, error: "Please fill all required fields." };
  }

  if (!allowedStatus.includes(status as (typeof allowedStatus)[number])) {
    return { ...initialState, error: "Invalid status value." };
  }

  const visitor = await prisma.visitor.findUnique({
    where: { id: visitorId },
    select: { id: true },
  });

  if (!visitor) {
    return { ...initialState, error: "Visitor not found." };
  }

  await prisma.$transaction([
    prisma.followUp.create({
      data: {
        visitorId,
        byId: currentUser.id,
        date: new Date(date),
        feedback,
        nextFollowUpDate: nextFollowUpDate ? new Date(nextFollowUpDate) : null,
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
    }),
    prisma.visitor.update({
      where: { id: visitorId },
      data: {
        status: status as
          | "NEW"
          | "PENDING"
          | "INTERESTED"
          | "MAYBE_LATER"
          | "JOINED"
          | "REJECTED"
          | "CATEGORY_CLASH"
          | "CLOSED",
        categoryClash: status === "CATEGORY_CLASH",
      },
    }),
  ]);

  revalidatePath("/overview");
  revalidatePath("/visitors");
  revalidatePath("/follow-ups");
  revalidatePath(`/personal-details/${visitorId}`);

  return {
    success: true,
    message: "Follow up saved successfully.",
    error: null,
  };
}
