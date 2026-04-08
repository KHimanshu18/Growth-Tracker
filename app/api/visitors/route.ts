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

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      name?: string;
      dateOfVisit?: string;
      category?: string;
      mobileNo?: string;
      emailAddress?: string | null;
      eoi?: string;
      invitedBy?: string | null;
      categoryClash?: boolean;
      assignedToId?: number | null;
      status?: string;
    };

    if (
      !body.name ||
      !body.dateOfVisit ||
      !body.category ||
      !body.mobileNo ||
      !body.eoi ||
      !body.status
    ) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 },
      );
    }

    const visitor = await prisma.visitor.create({
      data: {
        name: body.name,
        dateOfVisit: new Date(body.dateOfVisit),
        category: body.category,
        mobileNo: body.mobileNo,
        emailAddress: body.emailAddress ?? null,
        eoi: body.eoi as "YES" | "NO" | "MAYBE",
        invitedBy: body.invitedBy ?? null,
        categoryClash: Boolean(body.categoryClash),
        assignedToId: body.assignedToId ?? null,
        status: body.status as
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

    return NextResponse.json({ visitor }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Unable to create visitor." },
      { status: 500 },
    );
  }
}
