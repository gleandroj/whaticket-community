import * as Yup from "yup";

import AppError from "../../errors/AppError";
import { SerializeUser } from "../../helpers/SerializeUser";
import UserCompany from "../../models/UserCompany";
import ShowUserService from "./ShowUserService";

interface UserData {
  email?: string;
  password?: string;
  name?: string;
  profile?: string;
  queueIds?: number[];
  whatsappId?: number;
  companiesIds?: number[];
}

interface Request {
  userData: UserData;
  userId: string | number;
}

interface Response {
  id: number;
  name: string;
  email: string;
  profile: string;
}

const UpdateUserService = async (
  { userData, userId }: Request,
  loggedUserProfile?: string
): Promise<Response | undefined> => {
  const user = await ShowUserService(userId);

  if (
    loggedUserProfile &&
    user.profile === "superAdmin" &&
    loggedUserProfile !== "superAdmin"
  ) {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }

  const schema = Yup.object().shape({
    name: Yup.string().min(2),
    email: Yup.string().email(),
    profile: Yup.string(),
    password: Yup.string(),
    companiesIds: Yup.array().of(Yup.number())
  });

  const {
    email,
    password,
    profile,
    name,
    queueIds = [],
    companiesIds
  } = userData;

  try {
    await schema.validate({ email, password, profile, name });
  } catch (err: Error | any) {
    throw new AppError(err.message);
  }

  await user.update({
    email,
    password,
    profile,
    name
  });

  if (companiesIds) {
    await user.$set("companies", companiesIds);
  }

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

export default UpdateUserService;
