import { Sequelize, Op } from "sequelize";
import Company from "../../models/Company";

interface Request {
  searchParam?: string;
  pageNumber?: string | number;
}

interface Response {
  companies: Company[];
  count: number;
  hasMore: boolean;
}

const ListCompaniesService = async ({
  searchParam = "",
  pageNumber = "1"
}: Request): Promise<Response> => {
  const whereCondition = {
    [Op.or]: [
      {
        "$Company.name$": Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("Company.name")),
          "LIKE",
          `%${searchParam.toLowerCase()}%`
        )
      },
      { email: { [Op.like]: `%${searchParam.toLowerCase()}%` } },
      { cnpj: { [Op.like]: `%${searchParam.toLowerCase()}%` } }
    ]
  };

  const limit = 20;
  const offset = limit * (+pageNumber - 1);

  const { count, rows: companies } = await Company.findAndCountAll({
    where: whereCondition,
    attributes: ["id", "name", "email", "cnpj", "createdAt"],
    limit,
    offset,
    order: [["createdAt", "DESC"]]
  });

  const hasMore = count > offset + companies.length;

  return {
    companies,
    count,
    hasMore
  };
};

export default ListCompaniesService;
