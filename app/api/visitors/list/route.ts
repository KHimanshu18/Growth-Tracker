import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const visitors = await prisma.visitor.findMany({
    orderBy: {
      createdAt: "desc",
    },
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
      createdAt: true,
      updatedAt: true,
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          followUps: true,
        },
      },
    },
  });

  return NextResponse.json({ visitors });
}
