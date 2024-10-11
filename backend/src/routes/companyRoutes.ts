import { Router } from "express";
import * as CompanyController from "../controllers/CompanyController";

const companyRoutes = Router();

companyRoutes.post("/companies", CompanyController.store);
companyRoutes.get("/companies", CompanyController.index);
companyRoutes.get("/companies/:id", CompanyController.show);
companyRoutes.put("/companies/:id", CompanyController.update);
companyRoutes.delete("/companies/:id", CompanyController.remove);

export default companyRoutes;
