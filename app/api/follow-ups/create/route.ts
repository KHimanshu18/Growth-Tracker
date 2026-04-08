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
      visitorId?: number;
      date?: string;
      feedback?: string;
      nextFollowUpDate?: string | null;
      status?: string;
    };

    if (!body.visitorId || !body.date || !body.feedback || !body.status) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 },
      );
    }

    const created = await prisma.$transaction(async (tx) => {
      const followUp = await tx.followUp.create({
        data: {
          visitorId: body.visitorId!,
          byId: user.id,
          date: new Date(body.date!),
          feedback: body.feedback!,
          nextFollowUpDate:
            body.nextFollowUpDate ? new Date(body.nextFollowUpDate) : null,
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
        where: { id: body.visitorId! },
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
  } catch {
    return NextResponse.json(
      { message: "Unable to create follow up." },
      { status: 500 },
    );
  }
}
