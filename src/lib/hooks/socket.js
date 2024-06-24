import { useEffect, useState } from "react";
import io from "socket.io-client";
import { getSession } from "next-auth/react";

const useSocket = (url) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const setupSocket = async () => {
      const session = await getSession();
      const token = session?.externalJwt;

      if (token) {
        const socketInstance = io(url, {
          query: { token },
        });

        socketInstance.on("connect", () => {
          console.log("Socket.IO connection established");
        });

        socketInstance.on("disconnect", () => {
          console.log("Socket.IO connection closed");
        });

        setSocket(socketInstance);
      } else {
        console.log("No session token found, unable to connect to Socket.IO");
      }
    };

    setupSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [url]);

  return socket;
};

export default useSocket;
