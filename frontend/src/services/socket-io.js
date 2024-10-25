import openSocket from "socket.io-client";
import { getBackendUrl } from "../config";

let socketInstance = null;

export function connectToSocket() {
  if (!socketInstance) {
    const token = localStorage.getItem("token");
    console.log("backend-url", getBackendUrl());
    socketInstance = openSocket(getBackendUrl(), {
      transports: ["websocket", "polling", "flashsocket"],
      query: {
        token: token ? JSON.parse(token) : token,
      },
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      socketInstance = null;
    });
  }
  return socketInstance;
}
