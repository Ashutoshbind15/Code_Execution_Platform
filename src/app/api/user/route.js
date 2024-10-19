import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import ProblemSubmissions from "@/models/ProblemSubmissions";
import Problem from "@/models/Problem";
import Submission from "@/models/Submission";

export const GET = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated" },
      { status: 401 }
    );
  }

  const user = session.user;

  await connectDB();

  const ptosubs = await ProblemSubmissions.find({ uid: user.id }).populate({
    path: "submissions",
    model: Submission,
  });

  let numberOfCorrectProlemsSolved = 0;
  const correctProblems = [];

  for (let psub of ptosubs) {
    const submissions = psub.submissions;
    // console.log(psub.pid, submissions);
    let correct = false;
    for (let sub of submissions) {
      // console.log(sub);

      if (sub.success) {
        correct = true;
        break;
      }
    }
    if (correct) {
      numberOfCorrectProlemsSolved += 1;
      correctProblems.push(psub.pid);
    }
  }

  const numberOfProblemsCreated = await Problem.find({
    contributedBy: user._id,
  }).countDocuments();

  const problemsCreated = await Problem.find({ contributedBy: user._id });

  const populatedProblems = await Problem.find({
    _id: { $in: correctProblems },
  });

  return NextResponse.json(
    {
      user: {
        ...user,
        numberOfProblemsSolved: numberOfCorrectProlemsSolved,
        numberOfContributions: numberOfProblemsCreated,
        problemsSolved: populatedProblems,
        problemsCreated: problemsCreated,
      },
    },
    { status: 200 }
  );
};
