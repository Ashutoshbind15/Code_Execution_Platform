import { connectDB } from "@/lib/db";
import Contest from "@/models/Contest";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  await connectDB();
  const jsonBody = await req.json();
  const { title, description, div } = jsonBody;
  const contest = new Contest({ title, description, div });
  await contest.save();
  return NextResponse.json({ contest }, { status: 201 });
};

export const GET = async () => {
  await connectDB();
  const contests = await Contest.find();
  return NextResponse.json({ contests }, { status: 200 });
};
