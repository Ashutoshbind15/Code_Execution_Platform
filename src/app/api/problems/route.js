import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import Problem from "@/models/Problem";

export const GET = async () => {
  await connectDB();

  const problems = await Problem.find({});

  return NextResponse.json({ problems }, { status: 200 });
};
