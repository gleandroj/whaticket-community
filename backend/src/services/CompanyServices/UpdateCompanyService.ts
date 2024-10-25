import Company from "../../models/Company";
import AppError from "../../errors/AppError";

const UpdateCompanyService = async (id: string, companyData: any) => {
  const company = await Company.findByPk(id);

  if (!company) {
    throw new AppError("Empresa não encontrada", 404);
  }

  await company.update(companyData);
  return company;
};

export default UpdateCompanyService;
