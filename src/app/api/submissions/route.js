import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { connectDB } from "@/lib/db";
import ProblemSubmissions from "@/models/ProblemSubmissions";
import { NextResponse } from "next/server";
import Submission from "@/models/Submission";

export const POST = async (req) => {
  const sess = await getServerSession(authOptions);
  await connectDB();

  const uid = sess?.user?.id;
  const jsonBody = await req.json();
  const pid = jsonBody.problemId;
  const passed = jsonBody.passed;

  let sbm;

  if (passed) {
    sbm = new Submission({
      success: passed,
      tcNum: jsonBody.tcNum,
    });
  }

  if (!passed) {
    const testcase = jsonBody.testcase;
    const comparison = jsonBody.comparison;
    const tcNum = jsonBody.tcNum;
    const result = jsonBody.result;

    sbm = new Submission({
      success: passed,
      tcNum,
      expected: testcase.output,
      output: result,
      errors: comparison.differences,
    });
  }

  const hasUserSubmitted = await ProblemSubmissions.findOne({
    pid,
    uid,
  });

  if (hasUserSubmitted) {
    hasUserSubmitted.submissions.push(sbm);
    await hasUserSubmitted.save();
    await sbm.save();
  } else {
    const newProblemSubmission = new ProblemSubmissions({
      pid,
      uid,
      submissions: [sbm],
    });
    await newProblemSubmission.save();
    await sbm.save();
    return NextResponse.json({ sbm, newProblemSubmission }, { status: 201 });
  }

  return NextResponse.json({ sbm }, { status: 201 });
};

export const GET = async (req) => {
  const sess = await getServerSession(authOptions);
  await connectDB();
  const uid = sess?.user?.id;
  const { searchParams } = new URL(req.url);
  const pid = searchParams.get("pid");

  const populatedSubmissions = await ProblemSubmissions.findOne({
    pid,
    uid,
  }).populate({
    path: "submissions",
    model: Submission,
  });

  return NextResponse.json(
    { userSubmissions: populatedSubmissions },
    { status: 200 }
  );
};
