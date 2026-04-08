import { NextRequest, NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/dashboard";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const stats = await getDashboardStats();
  return NextResponse.json({ stats });
}
