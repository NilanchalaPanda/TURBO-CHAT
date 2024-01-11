"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children?: React.ReactNode;
}

// Utility Function - Send and recieve msg.
interface ISocketContext {
  sendMessage: (msg: string) => any;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

// CUSTOM HOOK -
export const useSocket = () => {
  const state = useContext(SocketContext);

  if (!state) throw new Error("State is not defined");

  return state;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  // STATE VARIABLES -
  const [socket, setSocket] = useState<Socket>();

  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg) => {
      console.log("Send Message", msg);

      if (socket) {
        socket.emit("event:message", { message: msg });
      }
    },
    [socket]
  );

  // Whenever the component is mounted :
  useEffect(() => {
    const _socket = io("http://localhost:8000");
    setSocket(_socket);

    // Cleaner Function -
    return () => {
      _socket.disconnect();
      setSocket(undefined);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
