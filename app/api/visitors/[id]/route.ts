import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await getUserFromRequest(request);

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const id = Number(params.id);

  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json(
      { message: "Invalid visitor id." },
      { status: 400 },
    );
  }

  const visitor = await prisma.visitor.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      dateOfVisit: true,
      category: true,
      mobileNo: true,
      emailAddress: true,
      eoi: true,
      invitedBy: true,
      categoryClash: true,
      status: true,
      assignedToId: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      followUps: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          visitorId: true,
          date: true,
          feedback: true,
          nextFollowUpDate: true,
          status: true,
          createdAt: true,
          by: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!visitor) {
    return NextResponse.json(
      { message: "Visitor not found." },
      { status: 404 },
    );
  }

  return NextResponse.json({ visitor });
}
