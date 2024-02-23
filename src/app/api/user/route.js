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
    NextResponse.json({ error: "You are not authenticated" }, { status: 401 });
  }

  const user = session.user;

  await connectDB();

  const ptosubs = await ProblemSubmissions.find({ uid: user.id }).populate({
    path: "submissions",
    model: Submission,
  });

  // ptosubs is an array of all the submissions made by the user
  // each submissionSchema has a property submissions which is an array of all the submissions made by the user to the problem
  // each submission has a property success which is a boolean

  let numberOfCorrectProlemsSolved = 0;

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
    }
  }

  console.log(numberOfCorrectProlemsSolved);

  const numberOfProblemsCreated = await Problem.find({
    contributedBy: user._id,
  }).countDocuments();

  return NextResponse.json(
    {
      user: {
        ...user,
        problemsSolved: numberOfCorrectProlemsSolved,
        contributions: numberOfProblemsCreated,
      },
    },
    { status: 200 }
  );
};
