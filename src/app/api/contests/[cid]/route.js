import Contest from "@/models/Contest";
import Problem from "@/models/Problem";
import { NextResponse } from "next/server";
import { io } from "socket.io-client";

export const GET = async (req, { params }) => {
  const { cid } = params;
  const contest = await Contest.findById(cid).populate("problems");
  return NextResponse.json({ contest }, { status: 200 });
};

export const POST = async (req, { params }) => {
  const { cid } = params;
  const jsonBody = await req.json();
  const { uid, pid } = jsonBody;

  //   const contest = await Contest;
  const contest = await Contest.findById(cid).populate([
    {
      path: "problems",
      model: Problem,
    },
  ]);
  const contestLeaderboard = contest.leaderboard;

  const user = contestLeaderboard.find((user) => {
    const stringUid = JSON.parse(JSON.stringify(user.uid));
    console.log(user.uid, uid, stringUid === uid);
    return stringUid === uid;
  });

  if (user) {
    user.points += pid;
    user.time = new Date();
    const userIndex = contestLeaderboard.findIndex((user) => user.uid === uid);
    contestLeaderboard[userIndex] = user;

    contestLeaderboard.sort((a, b) => {
      if (a.points === b.points) {
        return a.time - b.time;
      }
      return b.points - a.points;
    });

    // emit leaderboard update event

    // const socket = io("http://localhost:3000");
    // socket.emit("leaderboard", { contestLeaderboard });
    // socket.disconnect();

    const contestUpdated = await Contest.findByIdAndUpdate(
      cid,
      { leaderboard: contestLeaderboard },
      { new: true }
    ).populate([
      {
        path: "problems",
        model: Problem,
      },
    ]);

    return NextResponse.json({ contestUpdated }, { status: 201 });
  } else {
    contest.leaderboard.push({ uid, points: pid, time: new Date() });
    await contest.save();
    return NextResponse.json({ contestUpdated: contest }, { status: 201 });
  }
};
