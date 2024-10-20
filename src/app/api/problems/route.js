import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import Problem from "@/models/Problem";

export const GET = async (req) => {
  await connectDB();

  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (query && query.length > 0 && query === "private") {
    const sess = await getServerSession(authOptions);
    const uid = sess.user.id;

    const problems = await Problem.find({
      contributedBy: uid,
      visibility: false,
    });

    return NextResponse.json({ problems }, { status: 200 });
  }

  const problems = await Problem.find({});

  return NextResponse.json({ problems }, { status: 200 });
};

export const POST = async (req) => {
  await connectDB();

  const jsonBody = await req.json();

  const { formData, testcases, exampleTestcases } = jsonBody;

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

  for (let etc of exampleTestcases) {
    problem.exampleTestcases.push(etc);
  }

  await problem.save();

  return NextResponse.json(
    { msg: "Problem created", problem },
    { status: 201 }
  );
};
