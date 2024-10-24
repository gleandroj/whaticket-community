import { Router } from "express";
import * as CompanyController from "../controllers/CompanyController";
import isAuth from "../middleware/isAuth";

const companyRoutes = Router();

companyRoutes.post("/companies", isAuth, CompanyController.store);
companyRoutes.get("/companies", isAuth, CompanyController.index);
companyRoutes.get("/companies/:id", isAuth, CompanyController.show);
companyRoutes.put("/companies/:id", isAuth, CompanyController.update);
companyRoutes.delete("/companies/:id", isAuth, CompanyController.remove);

export default companyRoutes;
