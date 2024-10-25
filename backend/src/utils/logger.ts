import pino from "pino";

const logger = pino({
  prettyPrint: {
    ignore: "pid,hostname"
  },
  level: process.env.LOG_LEVEL || "debug"
});

export { logger };
