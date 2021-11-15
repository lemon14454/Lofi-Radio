import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface ContextInterface {
  socket: Socket | null;
}

interface ProviderProps {
  children?: React.ReactNode;
}

// const SERVER_URL = "http://localhost:5000";
const SERVER_URL = "https://lemon-lofiradio.herokuapp.app/";

const SocketContext = createContext<ContextInterface | null>(null);

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }: ProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(`${SERVER_URL}`);
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}
