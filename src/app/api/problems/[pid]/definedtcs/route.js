import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { connectDB } from "@/lib/db";
import { compareOutputs } from "@/lib/helperFunctions/exec/outputComp";
import { getResult, getToken } from "@/lib/runtcs";
import Problem from "@/models/Problem";
import ProblemSubmissions from "@/models/ProblemSubmissions";
import Submission from "@/models/Submission";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const POST = async (req, { params }) => {
  await connectDB();
  const sess = await getServerSession(authOptions);

  console.log("Session", sess);

  const data = await req.json();
  const { pid } = params;
  const uid = sess?.user?.id;

  const problem = await Problem.findById(pid);
  const tcs = problem.testcases;
  let i = 1;

  for (let tc of tcs) {
    const ip = tc.input;
    const op = tc.output;

    const token = await getToken({
      srcCode: data.srcCode,
      langId: data.langId,
      inputTestCase: ip,
    });

    const result = await getResult(token);

    if (!result.res) {
      return NextResponse.json({ msg: "EXECERR" }, { status: 500 });
    }

    const opComp = compareOutputs(result.res, op);
    if (!opComp.isMatch) {
      // todo: make a submission

      const sbm = new Submission({
        success: false,
        tcNum: i,
        expected: op,
        output: result.res,
        subErrors: opComp.differences,
      });

      const hasUserSubmitted = await ProblemSubmissions.findOne({
        pid,
        uid,
      });

      if (hasUserSubmitted) {
        hasUserSubmitted.submissions.push(sbm);
        await hasUserSubmitted.save();
      } else {
        const newProblemSubmission = new ProblemSubmissions({
          pid,
          uid,
          submissions: [sbm],
        });
        await newProblemSubmission.save();
      }

      await sbm.save();

      return NextResponse.json(
        { msg: "WA", tcNum: i, res: result.res },
        { status: 200 }
      );
    }

    i++;
  }

  const sbm = new Submission({
    success: true,
    tcNum: tcs.length,
  });

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
  }

  return NextResponse.json({ msg: "AC" }, { status: 200 });
};
