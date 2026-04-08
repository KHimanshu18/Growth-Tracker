import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== "VISITOR") {
    return NextResponse.json(
      { message: "Only visitors can access this endpoint." },
      { status: 403 },
    );
  }

  const visitor = await prisma.visitor.findUnique({
    where: { userId: user.id },
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
      { message: "Visitor record not found." },
      { status: 404 },
    );
  }

  return NextResponse.json({ visitor });
}
