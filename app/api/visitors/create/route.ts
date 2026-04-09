import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
      assignedToId?: string | null; // ✅ UUID
      status?: string;
    };

    // ✅ validate required fields
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

    // ✅ normalize assignedToId
    const assignedToId =
      body.assignedToId && body.assignedToId !== "none" ?
        body.assignedToId
      : null;

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
        assignedToId, // ✅ string | null
        status: body.status as
          | "NEW"
          | "PENDING"
          | "OVERDUE"
          | "INTERESTED"
          | "MAYBE_LATER"
          | "JOINED"
          | "REJECTED"
          | "CATEGORY_CLASH"
          | "CLOSED",
      },
    });

    return NextResponse.json({ visitor }, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Unable to create visitor." },
      { status: 500 },
    );
  }
}
