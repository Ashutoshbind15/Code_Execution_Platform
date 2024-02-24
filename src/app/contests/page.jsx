"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@/lib/hooks/queries";
import axios from "axios";
import { set } from "mongoose";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const ContestPage = () => {
  const [users, setUsers] = useState([]);
  const { user, isUserError, isUserLoading, userError } = useUser();
  const [socket, setSocket] = useState(null);
  const prpblemList = [1, 2, 3, 4, 5];

  const wsApi = "http://localhost:3001";

  const updateRankings = () => {};

  const sendPointsToServer = async (pid) => {
    await axios.post(`/api/contests/65d9ed3f017e31524456ca86`, {
      uid: user.id,
      pid,
    });
  };

  const fetchInitialUsers = async () => {
    const { data } = await axios.get(`${wsApi}/users`);
    const initialUsers = data.users;
    console.log(data);
    setUsers(initialUsers);
  };

  // client -> [problems => {pid, solved}], leaderboard -> [{uid, points, time, rank}]
  // server -> leaderboard -> [{uid, points, time, rank}], the ranks and leaderboard is computed on the server and sends it to the ws server
  // wsserver -> emits back to the client the updated leaderboard and the points
  // client -> onSubmit(pid) -> sendPointsToServer(pid, points) -> updateRankings() -> emitRankings() -> wsserver -> emitRankings() -> client -> updateRankings()

  useEffect(() => {
    fetchInitialUsers();

    const socket = io(wsApi);
    if (user) {
      setSocket(socket);

      socket.on("connect", () => {
        socket.emit("authenticate", user.id);
      });

      socket.on("authenticated", (message) => {
        console.log(message.msg);
        console.log(message.userId);

        setUsers((prev) => [...prev, user.id]);
      });
    }

    return () => {
      if (socket) {
        console.log("disconnecting");
        socket.disconnect();
      }
    };
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on("leaderboard", (msg) => {
        console.log(msg); // Handle incoming messages
      });

      socket.on("joincontest", (data) => {
        const uid = data.uid;
        setUsers((prev) => [...prev, uid]);
      });

      socket.on("leavecontest", (data) => {
        const uid = data.uid;
        setUsers((prev) => prev.filter((u) => u !== uid));
      });
    }

    return () => {
      if (socket) {
        console.log("disconnecting");
        socket.disconnect();
      }
    };
  }, [socket]);

  return (
    <div>
      {users?.map((u) => (
        <div key={u.toString()}>{JSON.stringify(u)}</div>
      ))}

      {prpblemList.map((p) => (
        <div className="flex items-center space-x-2" key={p}>
          <Checkbox
            id="terms2"
            onCheckedChange={(e) => sendPointsToServer(p)}
          />
          <label
            htmlFor="terms2"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {p}
          </label>
        </div>
      ))}
    </div>
  );
};

export default ContestPage;
