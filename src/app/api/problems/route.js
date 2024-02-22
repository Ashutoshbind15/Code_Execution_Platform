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

export const POST = async (req) => {
  await connectDB();

  const jsonBody = await req.json();

  const { formData, testcases } = jsonBody;

  console.log(formData, testcases);

  const { title, description, difficulty, input, output } = formData;

  const problem = new Problem({
    title,
    description,
    difficulty,
    inputDescription: input,
    outputDescription: output,
  });

  for (let tc of testcases) {
    problem.testcases.push(tc);
  }

  await problem.save();

  return NextResponse.json(
    { msg: "Problem created", problem },
    { status: 201 }
  );
};
