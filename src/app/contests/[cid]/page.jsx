"use client";

import { useUser } from "@/lib/hooks/queries";
import useSocket from "@/lib/hooks/socket";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";

const ContestPage = () => {
  // client -> [problems => {pid, solved}], leaderboard -> [{uid, points, time, rank}]
  // server -> leaderboard -> [{uid, points, time, rank}], the ranks and leaderboard is computed on the server and sends it to the client
  // wsserver -> emits back to the client the updated leaderboard and the points
  // client -> onSubmit(pid) -> sendPointsToServer(pid, points) -> updateRankings() -> emitRankings() -> wsserver -> emitRankings() -> client -> updateRankings()

  const { user, isUserError, isUserLoading, userError } = useUser();
  const [leaderboard, setLeaderboard] = useState([]); // [{uid, points, time, rank}
  const [contest, setContest] = useState(null);
  const [probems, setProblems] = useState([]);
  const socket = useSocket("http://localhost:3001");
  const params = useParams();
  const cid = params.cid;
  const rtr = useRouter();

  console.log(leaderboard);

  const initialLeaderboardFetcher = async (cid) => {
    const { data } = await axios.get(`/api/contests/${cid}`);
    setLeaderboard(data.contest.leaderboard);
    setContest(data.contest);
    setProblems(data.contest.problems);
  };

  const sendPointsToServer = async (pid, cid) => {
    const { data } = await axios.post(`/api/contests/${cid}`, {
      uid: user.id,
      pid,
    });

    // console.log(data);
    // socket.emit("leaderboard", data.contestUpdated.leaderboard);
  };

  useEffect(() => {
    if (socket) {
      socket.on("leaderboard", (data) => {
        setLeaderboard(data);
      });
    }

    if (cid) {
      initialLeaderboardFetcher(cid);
    }
  }, [cid, socket]);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between px-6 py-2 bg-black text-white font-semibold">
        <div className="flex flex-col gap-y-2">
          <div>{contest?.title}</div>
          <div>{contest?.div}</div>
        </div>
        {contest?.endTime && <Countdown date={contest?.endTime} />}
      </div>

      {contest?.problems.map((problem) => (
        <div
          key={problem._id}
          className="flex items-center justify-between px-6 py-2 border-b cursor-pointer"
          onClick={() => {
            rtr.push(`/contests/${cid}/${problem._id}`);
          }}
        >
          <div>{problem.title}</div>
        </div>
      ))}
    </div>
  );
};

export default ContestPage;
