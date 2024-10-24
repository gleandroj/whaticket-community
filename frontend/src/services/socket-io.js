import openSocket from "socket.io-client";
import { getBackendUrl } from "../config";

function connectToSocket() {
  const token = localStorage.getItem("token");
  console.log("backend-url", getBackendUrl());
  return openSocket(getBackendUrl(), {
    transports: ["websocket", "polling", "flashsocket"],
    query: {
      token: token ? JSON.parse(token) : token,
    },
  });
}

export default connectToSocket;
