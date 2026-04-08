import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const visitorIdParam = request.nextUrl.searchParams.get("visitorId");
  const visitorId =
    visitorIdParam && visitorIdParam !== "none" ? visitorIdParam : null;

  const followUps = await prisma.followUp.findMany({
    where: visitorId ? { visitorId } : undefined,
    orderBy: { createdAt: "desc" },
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
  });

  return NextResponse.json({ followUps });
}

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      visitorId?: string;
      date?: string;
      feedback?: string;
      nextFollowUpDate?: string | null;
      status?: string;
    };

    const visitorId =
      body.visitorId && body.visitorId !== "none" ? body.visitorId : null;

    // ✅ Strict validation (fixes undefined issues)
    if (!visitorId || !body.date || !body.feedback || !body.status) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 },
      );
    }

    // ✅ Now TypeScript knows these are defined
    const date = new Date(body.date);
    const nextFollowUpDate =
      body.nextFollowUpDate ? new Date(body.nextFollowUpDate) : null;

    const created = await prisma.$transaction(async (tx) => {
      const followUp = await tx.followUp.create({
        data: {
          visitorId,
          byId: user.id,
          date,
          feedback: body.feedback!,
          nextFollowUpDate,
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
      });

      await tx.visitor.update({
        where: { id: visitorId },
        data: {
          status: body.status as
            | "NEW"
            | "PENDING"
            | "INTERESTED"
            | "MAYBE_LATER"
            | "JOINED"
            | "REJECTED"
            | "CATEGORY_CLASH"
            | "CLOSED",
          categoryClash: body.status === "CATEGORY_CLASH",
        },
      });

      return followUp;
    });

    return NextResponse.json({ followUp: created }, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Unable to create follow up." },
      { status: 500 },
    );
  }
}
