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
      visitorId?: string;
      date?: string;
      feedback?: string;
      nextFollowUpDate?: string | null;
      status?: string;
    };

    // ✅ normalize + narrow types
    const visitorId =
      typeof body.visitorId === "string" && body.visitorId !== "none" ?
        body.visitorId
      : null;

    const dateStr = typeof body.date === "string" ? body.date : null;

    const feedback = typeof body.feedback === "string" ? body.feedback : null;

    const status = typeof body.status === "string" ? body.status : null;

    if (!visitorId || !dateStr || !feedback || !status) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 },
      );
    }

    const date = new Date(dateStr);
    const nextFollowUpDate =
      body.nextFollowUpDate && typeof body.nextFollowUpDate === "string" ?
        new Date(body.nextFollowUpDate)
      : null;

    const created = await prisma.$transaction(async (tx) => {
      const followUp = await tx.followUp.create({
        data: {
          visitorId, // ✅ now strictly string
          byId: user.id,
          date,
          feedback, // ✅ now strictly string
          nextFollowUpDate,
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
