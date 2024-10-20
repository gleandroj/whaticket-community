import * as Yup from "yup";
import AppError from "../../errors/AppError";
import { SerializeUser } from "../../helpers/SerializeUser";
import User from "../../models/User";
import EmpresaFuncionario from "../../models/EmpresaFuncionario";

interface Request {
  email: string;
  password: string;
  name: string;
  queueIds?: number[];
  profile?: string;
  companyId: number; // Adicionado companyId como obrigatório
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
  companyId
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
    companyId: Yup.number().required("Company is required.") // Validando companyId
  });

  try {
    await schema.validate({ email, password, name, companyId });
  } catch (err) {
    throw new AppError(err.message);
  }

  const user = await User.create(
    {
      email,
      password,
      name,
      profile,
      companyId
    },
    { include: ["queues", "whatsapp"] }
  );

  await user.$set("queues", queueIds);

  await EmpresaFuncionario.create({
    userId: user.id,
    companyId
  });

  await user.reload();

  return SerializeUser(user);
};

export default CreateUserService;
