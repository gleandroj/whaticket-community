import { createContext, default as React, useCallback, useMemo } from "react";

const SocketIOContext = createContext();

const SocketIOProvider = ({ children }) => {
  const connection = useMemo(() => {
    return {
      on: () => {},
      disconnect: () => {},
    };
  }, []);

  const connectToSocket = useCallback(() => {
    return connection;
  }, []);

  const disconnect = useCallback(() => {}, []);

  return (
    <SocketIOContext.Provider
      value={{ connection, connectToSocket, disconnect }}
    >
      {children}
    </SocketIOContext.Provider>
  );
};

export { SocketIOContext, SocketIOProvider };
