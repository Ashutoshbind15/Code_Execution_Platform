"use client";

import { Button } from "@/components/ui/button";
import useSocket from "@/lib/hooks/socket";
import axios from "axios";
import React, { useEffect, useState } from "react";

const sockerserverUri = "http://localhost:3001";

const ContestProblemPage = ({ params }) => {
  const socket = useSocket(sockerserverUri);
  const [result, setResult] = useState(null);

  const { pid, cid } = params;

  useEffect(() => {
    const asyncwrapper = async () => {
      if (result && result === "Passed") {
        const { data } = await axios.post(`/api/contests/${cid}/${pid}`);

        // this ep updates the leaderboard if the problem wasn't solved before
        // the db update before the emit is important

        // but this slows down the process, will later switch to some stream dumps and worker to update the leaderboard

        if (data.message) {
        } else if (data.leaderBoard) {
          const leaderboard = data.leaderBoard;
          console.log("Sending leaderboard", leaderboard);
          socket.emit("leaderboard", leaderboard);
        }

        socket.emit("contest:problem", { ...params, result: "Passed" });
      } else if (result && result === "Failed") {
        socket.emit("contest:problem", { ...params, result: "Failed" });
      }
    };

    asyncwrapper();
  }, [result]);

  const mockupResultPassedSetter = () => {
    // have a promise that resolves after 2 seconds
    new Promise((resolve) => {
      setTimeout(() => {
        resolve("Passed");
      }, 2000);
    }).then(setResult);
  };

  const mockupResultFailedSetter = () => {
    // have a promise that resolves after 2 seconds
    new Promise((_, reject) => {
      setTimeout(() => {
        reject("Failed");
      }, 2000);
    }).catch(setResult);
  };

  return (
    <div>
      <div>
        Problem {pid} for contest {cid}
      </div>

      <div>{result}</div>

      <Button onClick={mockupResultPassedSetter}>Pass</Button>
      <Button onClick={mockupResultFailedSetter}>Fail</Button>
    </div>
  );
};

export default ContestProblemPage;
