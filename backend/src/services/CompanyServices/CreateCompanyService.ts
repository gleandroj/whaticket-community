import Company from "../../models/Company";
import UserCompany from "../../models/UserCompany";

interface CompanyData {
  name: string;
  cnpj: string;
  email: string;
}

async function CreateCompanyService(
  companyData: CompanyData
): Promise<Company> {
  const company = await Company.create(companyData);

  UserCompany.create({
    companyId: company.id,
    userId: 1
  });

  return company;
}

export default CreateCompanyService;
