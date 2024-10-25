import Company from "../../models/Company";
import Setting from "../../models/Setting";
import UserCompany from "../../models/UserCompany";
import CreateDefaultSettingsService from "../SettingServices/CreateDefaultSettingsService";

interface CompanyData {
  name: string;
  cnpj: string;
  email: string;
}

async function CreateCompanyService(
  companyData: CompanyData
): Promise<Company> {
  const company = await Company.create(companyData);

  Setting.create({
    companyId: company.id,
    name: "default",
    theme: "light"
  });

  await CreateDefaultSettingsService({
    companyId: company.id
  });

  UserCompany.create({
    companyId: company.id,
    userId: 1,
    isActive: false
  });

  return company;
}

export default CreateCompanyService;
