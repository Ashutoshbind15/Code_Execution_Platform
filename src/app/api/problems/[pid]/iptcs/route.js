import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { connectDB } from "@/lib/db";
import { compareOutputs } from "@/lib/helperFunctions/exec/outputComp";
import { getResult, getToken } from "@/lib/runtcs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const POST = async (req, { params }) => {
  await connectDB();
  const sess = await getServerSession(authOptions);

  if (!sess || !sess.user) {
    return NextResponse.json({ msg: "UNAUTH" }, { status: 401 });
  }

  const data = await req.json();
  const { tcs } = data;
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

    console.log("Result", result);

    if (!result.res) {
      return NextResponse.json({ msg: "EXECERR" }, { status: 500 });
    }

    const opComp = compareOutputs(result.res, op);
    if (!opComp.isMatch) {
      // todo: make a submission

      return NextResponse.json(
        { msg: "WA", tcNum: i, res: result.res },
        { status: 200 }
      );
    }

    i++;
  }

  return NextResponse.json({ msg: "AC" }, { status: 200 });
};
