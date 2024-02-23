import { connectDB } from "@/lib/db";
import Submission from "@/models/Submission";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const pid = searchParams.get("pid");

  const submission = await Submission.findById(pid);

  return NextResponse.json({ submission }, { status: 200 });
};
