import Company from "../../models/Company";
import AppError from "../../errors/AppError";

const DeleteCompanyService = async (id: string) => {
  const company = await Company.findByPk(id);

  if (!company) {
    throw new AppError("Empresa não encontrada", 404);
  }

  await company.destroy();
};

export default DeleteCompanyService;
