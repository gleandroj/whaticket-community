import { Server } from "http";
import { verify } from "jsonwebtoken";
import { Namespace, Socket, Server as SocketIO } from "socket.io";
import authConfig from "../config/auth";
import AppError from "../errors/AppError";
import { SerializeUser } from "../helpers/SerializeUser";
import User from "../models/User";
import ShowUserService from "../services/UserServices/ShowUserService";
import { logger } from "../utils/logger";

let io: SocketIO;

const authenticate = async (token: string, companyId?: number) => {
  let tokenData: any = null;
  let user: User | null = null;
  let activeCompanyId: number | undefined;

  try {
    tokenData = verify(token, authConfig.secret);
    user = await ShowUserService(tokenData.id);
    activeCompanyId = user.getActiveCompany()?.id;
    if (!user) {
      logger.error("User not found", "io-onConnection", tokenData);
      throw new AppError("User not found", 401);
    }

    if (companyId !== undefined && companyId !== activeCompanyId) {
      logger.error("User not authorized", "io-onConnection", tokenData);
      throw new AppError("User not authorized", 401);
    }
    logger.debug(JSON.stringify(tokenData), "io-onConnection: tokenData");
  } catch (error) {
    logger.error(JSON.stringify(error), "Error decoding token");

    throw new AppError("Invalid token", 401);
  }

  return {
    tokenData,
    user: SerializeUser(user),
    activeCompanyId
  };
};

export const initIO = (httpServer: Server): SocketIO => {
  io = new SocketIO(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL
    }
  });

  io.of("/").on("connection", async s => {
    logger.info("Socket client Connected to default namespace");

    const socket = s as Socket;

    authenticate(socket.handshake.query.token as string)
      .then(data => {
        logger.info("Socket client authenticated to default namespace");

        socket.on("disconnect", () => {
          logger.info("Socket client disconnected from default namespace");
        });

        setTimeout(() => {
          logger.info("Socket client switch namespace requested");
          socket.emit("switch:namespace", {
            activeCompanyId: data.activeCompanyId
          });
        }, 200);
      })
      .catch(error => {
        logger.error(JSON.stringify(error), "io-onConnection: authenticate");
        socket.disconnect(true);
      });

    return socket;
  });

  io.of(/^\/companies-\d+$/).on("connection", async s => {
    const socket = s as Socket;
    const namespace = socket.nsp;
    const companyId = parseInt(namespace.name.split("-")[1], 10);

    logger.info(`Socket client connected to namespace ${namespace.name}`);

    authenticate(socket.handshake.query.token as string, companyId)
      .then(data => {
        socket.join(`users:${data.user.id}`);
        socket.on("join:room", (room: string[]) => {
          const roomId = room.join(":");
          console.log("join:room", roomId);

          if (socket.rooms.has(roomId)) {
            return;
          }

          socket.join(roomId);
        });

        socket.on("leave:room", (room: string[]) => {
          console.log("leave:room", room.join(":"));

          if (!socket.rooms.has(room.join(":"))) {
            return;
          }

          socket.leave(room.join(":"));
        });

        socket.on("disconnect", () => {
          logger.info("Socket client disconnected from company namespace");
        });

        setInterval(() => {
          socket.emit("ping");
        }, 1000 * 20);

        setTimeout(() => {
          logger.info("Socket client authenticated to company namespace");
          socket.emit("authenticated", {
            user: data.user,
            activeCompanyId: data.activeCompanyId
          });
        }, 200);
      })
      .catch(error => {
        logger.error(JSON.stringify(error), "io-onConnection: authenticate");
        socket.disconnect(true);
      });

    return socket;
  });

  return io;
};

export const getIO = (companyId?: number): Namespace => {
  if (!io) {
    throw new AppError("Socket IO not initialized");
  }

  return io.of(companyId ? `/companies-${companyId}` : "/");
};
