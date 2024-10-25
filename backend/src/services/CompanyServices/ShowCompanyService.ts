import Company from "../../models/Company";

const ShowCompanyService = async (id: string) => {
  const company = await Company.findByPk(id);
  return company;
};

export default ShowCompanyService;
