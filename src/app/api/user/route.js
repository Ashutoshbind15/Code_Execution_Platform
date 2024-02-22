import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export const GET = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    NextResponse.json({ error: "You are not authenticated" }, { status: 401 });
  }

  const user = session.user;

  return NextResponse.json({ user }, { status: 200 });
};
