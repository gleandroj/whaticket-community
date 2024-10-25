import _ from "lodash";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { connectToSocket as connect } from "../../services/socket-io";

const SocketIOContext = createContext();

const ignoredEvents = ["connect", "disconnect", "ping", "authenticated"];
const MAX_RECONNECT_ATTEMPTS = 30;

const SocketIOProvider = ({ children }) => {
  /**
   * @type {import("react").MutableRefObject<import("socket.io-client").io.Socket | null>}
   */
  const connectionRef = useRef(null);
  const connectCountRef = useRef(0);
  const isConnectedRef = useRef(false);
  const isAuthenticatedRef = useRef(false);
  const reconnectAttemptsRef = useRef(0);
  const eventListenersRef = useRef({});
  const openRoomsRef = useRef([]);

  const attachEventListeners = (socket) => {
    Object.keys(eventListenersRef.current).forEach((event) => {
      if (
        !ignoredEvents.includes(event) &&
        eventListenersRef.current[event].length > 0
      ) {
        console.log("[SOCKET]: Attaching event listener for", event);
        socket.on(event, (data) => {
          console.log("[SOCKET]: Event received", event, data);
          eventListenersRef.current[event].forEach((callback) =>
            callback(data)
          );
        });
      }
    });

    socket.on("authenticated", (data) => {
      isAuthenticatedRef.current = true;
      reconnectAttemptsRef.current = 0; // Reset attempts on successful connection
      console.log("[SOCKET]: Authenticated", data);
      (eventListenersRef.current["authenticated"] || []).forEach((cb) =>
        cb(data)
      );
    });

    console.log("[SOCKET]: Connected - firing 'connect' callbacks");
    (eventListenersRef.current["connect"] || []).forEach((cb) => cb());
  };

  const handleSocketDisconnect = (companyId) => {
    if (connectionRef.current) {
      console.log("[SOCKET]: Socket disconnected");
      connectionRef.current.removeAllListeners();
      connectionRef.current.close();
      isConnectedRef.current = false;
      isAuthenticatedRef.current = false;
      connectionRef.current = null;

      if (
        connectCountRef.current > 0 &&
        reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS
      ) {
        reconnectAttemptsRef.current++;
        const reconnectDelay = 1000 * 2 * (reconnectAttemptsRef.current - 1); // backoff
        console.log(
          `[SOCKET]: Attempting reconnect #${reconnectAttemptsRef.current} in ${
            reconnectDelay / 1000
          }s`
        );
        setTimeout(() => connectToSocket(companyId), reconnectDelay);
      } else {
        console.log(
          "[SOCKET]: Max reconnect attempts reached, stopping reconnection"
        );
      }
    }
  };

  const connection = useMemo(
    () => ({
      on: (event, callback) => {
        if (!eventListenersRef.current[event]) {
          eventListenersRef.current[event] = [];
          if (
            connectionRef.current &&
            isConnectedRef.current &&
            !ignoredEvents.includes(event)
          ) {
            console.log("[SOCKET]: Attaching event on", event);

            connectionRef.current.on(event, (data) => {
              console.log("[SOCKET]: Event received", event, data);
              eventListenersRef.current[event].forEach((cb) => cb(data));
            });
          }
        }

        eventListenersRef.current[event].push(callback);

        if (event === "connect" && isConnectedRef.current) {
          console.log("[SOCKET]: Immediate connect callback firing");
          callback();
        }

        if (event === "authenticated" && isAuthenticatedRef.current) {
          console.log("[SOCKET]: Immediate authenticated callback firing");
          callback();
        }
      },
      off: (event, callback) => {
        if (eventListenersRef.current[event]) {
          console.log("before", eventListenersRef.current[event].length);

          eventListenersRef.current[event] = eventListenersRef.current[
            event
          ].filter((cb) => cb !== callback);

          console.log("after", eventListenersRef.current[event]);

          if (
            connectionRef.current &&
            eventListenersRef.current[event].length === 0
          ) {
            console.log("[SOCKET]: Detaching event", event);
            connectionRef.current.off(event);
          }
        }
      },
      disconnect: (force) => {
        connectCountRef.current--;
        console.log(
          "[SOCKET]: Disconnect called, count",
          connectCountRef.current
        );
        if (connectCountRef.current === 0 || force) {
          console.log("[SOCKET]: Disconnecting from socket");
          connectionRef.current.disconnect();
          isConnectedRef.current = false;
        }
      },
      emit: (event, data) => {
        if (event.startsWith("join:room")) {
          console.log("[SOCKET]: Joining room", data);
          openRoomsRef.current.push(data);
        } else if (event.startsWith("leave:room")) {
          console.log("[SOCKET]: Leaving room", data);
          openRoomsRef.current = openRoomsRef.current.filter(
            (room) => !_.isEqual(room, data)
          );
        }
        console.log("[SOCKET]: Emitting event", event, data);
        connectionRef.current.emit(event, data);
      },
    }),
    []
  );

  const connectToSocket = useCallback((companyId = 1) => {
    connectCountRef.current++;
    const token = localStorage.getItem("token");
    if (token && !connectionRef.current) {
      console.log("[SOCKET]: Connecting to socket");
      connectionRef.current = connect(token, companyId);
      isAuthenticatedRef.current = false;

      connectionRef.current.on("connect", () => {
        console.log("[SOCKET]: Socket connected");
        isConnectedRef.current = true;
        attachEventListeners(connectionRef.current);
      });

      connectionRef.current.on("switch:namespace", (data) => {
        handleSocketDisconnect(data.activeCompanyId);
      });

      connectionRef.current.on("disconnect", () =>
        handleSocketDisconnect(companyId)
      );
    }
    return connection;
  }, []);

  useEffect(() => {
    console.log("[SOCKET]: Setting up ping-pong listeners");
    connection.on("ping", () => {
      console.log("[SOCKET]: Ping received, sending pong");
      connection.emit("pong");
    });

    return () => {
      console.log("[SOCKET]: Cleaning up on unmount");
      connectionRef.current.disconnect();
      connectCountRef.current = 0;
      isConnectedRef.current = false;
    };
  }, []);

  return (
    <SocketIOContext.Provider value={{ connection, connectToSocket }}>
      {children}
    </SocketIOContext.Provider>
  );
};

export { SocketIOContext, SocketIOProvider };
