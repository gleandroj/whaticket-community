import { Router } from "express";

import isAuth from "../middleware/isAuth";
import * as UserCompanyController from "../controllers/UserCompanyController";

const userRoutes = Router();

userRoutes.get(
  "/users-companies",
  isAuth,
  UserCompanyController.listUserComapany
);
userRoutes.get(
  "/users-companies/:companyId/switch",
  isAuth,
  UserCompanyController.switchUserCompany
);

export default userRoutes;
