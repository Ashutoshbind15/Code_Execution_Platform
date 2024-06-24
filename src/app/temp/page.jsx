"use client";

import useSocket from "@/lib/hooks/socket";
import { useEffect } from "react";

const HomePage = () => {
  const socket = useSocket(process.env.NEXT_PUBLIC_WSS_URI);

  useEffect(() => {
    if (socket) {
      socket.on("message", (data) => {
        console.log("Message from server:", data);
      });
    }
  }, [socket]);

  return (
    <div>
      <h1>Socket.IO with NextAuth</h1>
    </div>
  );
};

export default HomePage;
