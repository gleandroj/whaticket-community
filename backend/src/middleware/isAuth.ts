import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import authConfig from "../config/auth";
import AppError from "../errors/AppError";
import ShowUserService from "../services/UserServices/ShowUserService";

interface TokenPayload {
  id: string;
  username: string;
  profile: string;
  iat: number;
  exp: number;
}

const isAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("ERR_SESSION_EXPIRED", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = verify(token, authConfig.secret);
    const { id, profile } = decoded as TokenPayload;

    ShowUserService(id).then(user => {
      if (!user) {
        throw new AppError("User not found", 404);
      }

      const activeCompany = user.companies.find(
        company => company.UserCompany.isActive
      );

      if (!activeCompany) {
        throw new AppError("User does not have active company", 401);
      }

      req.user = {
        id,
        profile,
        companyId: activeCompany?.id
      };

      next();
    });
  } catch (err) {
    throw new AppError(
      "Invalid token. We'll try to assign a new one on next request",
      403
    );
  }
};

export default isAuth;
