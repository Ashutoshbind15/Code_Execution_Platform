import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Contest from "@/models/Contest";
import ContestSubmissions from "@/models/ContestSubmissions";
import Problem from "@/models/Problem";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const problemDifficultyToPointsMapper = (difficulty) => {
  switch (difficulty) {
    case "easy":
      return 100;
    case "medium":
      return 200;
    case "hard":
      return 300;
    default:
      return 0;
  }
};

export const POST = async (req, { params }) => {
  try {
    const { cid, pid } = params;
    const sess = await getServerSession(authOptions);

    if (!sess) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const uid = sess.user.id;
    const problem = await Problem.findById(pid);

    const userSubmissions = await ContestSubmissions.findOne({ uid });

    const hasPassedBefore = userSubmissions?.some(
      (submission) =>
        submission === problemDifficultyToPointsMapper(problem.difficulty)
    );

    if (!hasPassedBefore) {
      const points = problemDifficultyToPointsMapper(problem.difficulty);
      const contest = await Contest.findById(cid).select("leaderboard");
      const leaderBoard = contest.leaderboard;

      const userIdx = leaderBoard.findIndex((entry) => entry.uid === uid);

      if (userIdx === -1) {
        leaderBoard.push({ uid, points, time: new Date() });
      } else {
        leaderBoard[userIdx].points += points;
        leaderBoard[userIdx].time = new Date();
      }

      await Contest.findByIdAndUpdate(cid, { leaderboard: leaderBoard });

      console.log(userSubmissions);

      if (!userSubmissions) {
        await ContestSubmissions.create({ uid, submissions: [points] });
      } else {
        await ContestSubmissions.updateOne(
          { uid },
          { $push: { submissions: points } }
        );
      }

      return NextResponse.json({ leaderBoard }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Already passed" }, { status: 200 });
    }
  } catch (error) {
    console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
