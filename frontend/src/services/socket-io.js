import { io } from "socket.io-client";
import { getBackendUrl } from "../config";

/**
 *
 * @param {string} token
 * @param {number} companyId
 * @returns {import("socket.io-client").io.Socket}
 */
export function connectToSocket(token, companyId) {
  const url = getBackendUrl();
  const namespace = companyId ? `/companies-${companyId}` : ``;
  console.log("Connecting to: ", { url, namespace });

  return io(url + namespace, {
    transports: ["websocket", "polling", "flashsocket"],
    query: {
      token: token ? JSON.parse(token) : token,
    },
  });
}
