import Company from "../../models/Company";

const CreateCompanyService = async (companyData: any) => {
  const company = await Company.create(companyData);
  return company;
};

export default CreateCompanyService;
