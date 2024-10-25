import { useContext } from "react";
import { SocketIOContext } from "./SocketIOContext";

export const useSocketIO = () => {
  return useContext(SocketIOContext);
};

export default useSocketIO;
