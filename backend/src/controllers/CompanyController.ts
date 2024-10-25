import { Request, Response } from "express";
import AppError from "../errors/AppError";
import { getIO } from "../libs/socket";

import CreateCompanyService from "../services/CompanyServices/CreateCompanyService";
import ListCompaniesService from "../services/CompanyServices/ListCompaniesService";
import ShowCompanyService from "../services/CompanyServices/ShowCompanyService";
import UpdateCompanyService from "../services/CompanyServices/UpdateCompanyService";
import DeleteCompanyService from "../services/CompanyServices/DeleteCompanyService";
import ShowUserService from "../services/UserServices/ShowUserService";

export const index = async (req: Request, res: Response): Promise<Response> => {
  const searchParam = (req.query.searchParam as string) || "";
  const pageNumber = req.query.pageNumber
    ? parseInt(req.query.pageNumber as string, 10)
    : 1;

  const companies = await ListCompaniesService({
    searchParam,
    pageNumber
  });

  return res.status(200).json(companies);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  if (req.user.profile !== "superAdmin") {
    throw new AppError("Você não tem permissão para criar empresas", 403);
  }

  const companyData = req.body;
  const company = await CreateCompanyService(companyData);

  const io = getIO(req.user.companyId);
  io.emit("company", {
    action: "create",
    company
  });

  return res.status(201).json(company);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  const company = await ShowCompanyService(id);

  if (!company) {
    throw new AppError("Empresa não encontrada", 404);
  }

  return res.status(200).json(company);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const companyData = req.body;

  const updatedCompany = await UpdateCompanyService(id, companyData);

  const io = getIO(req.user.companyId);
  io.emit("company", {
    action: "update",
    updatedCompany
  });

  return res.status(200).json(updatedCompany);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  await DeleteCompanyService(id);

  const io = getIO(req.user.companyId);
  io.emit("company", {
    action: "delete",
    id
  });

  return res.status(204).json({ message: "Empresa deletada com sucesso" });
};
