import * as Yup from "yup";
import AppError from "../../errors/AppError";
import { SerializeUser } from "../../helpers/SerializeUser";
import User from "../../models/User";
import UserCompany from "../../models/UserCompany";

interface Request {
  email: string;
  password: string;
  name: string;
  queueIds?: number[];
  profile?: string;
  companiesIds?: number[];
}

interface Response {
  email: string;
  name: string;
  id: number;
  profile: string;
}

const CreateUserService = async ({
  email,
  password,
  name,
  queueIds = [],
  profile = "admin",
  companiesIds
}: Request): Promise<Response> => {
  const schema = Yup.object().shape({
    name: Yup.string().required().min(2),
    email: Yup.string()
      .email()
      .required()
      .test(
        "Check-email",
        "An user with this email already exists.",
        async value => {
          if (!value) return false;
          const emailExists = await User.findOne({ where: { email: value } });
          return !emailExists;
        }
      ),
    password: Yup.string().required().min(5),
    companiesIds: Yup.array().of(Yup.number())
  });

  try {
    await schema.validate({ email, password, name, companiesIds });
  } catch (err: Error | any) {
    throw new AppError(err.message);
  }

  const user = await User.create(
    {
      email,
      password,
      name,
      profile
    },
    { include: ["queues", "whatsapp", "companies"] }
  );

  await user.$set("companies", companiesIds || []);
  await user.$set("queues", queueIds);

  await user.reload();

  user.companies.forEach(company => {
    const isLast =
      user.companies.indexOf(company) === user.companies.length - 1;
    UserCompany.update(
      { isActive: isLast },
      { where: { companyId: company.id } }
    );
  });

  return SerializeUser(user);
};

export default CreateUserService;
