import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import Problem from "@/models/Problem";

export const GET = async (req, { params }) => {
  await connectDB();
  const pid = params.pid;

  const problem = await Problem.findById(pid);

  return NextResponse.json({ problem }, { status: 200 });
};
