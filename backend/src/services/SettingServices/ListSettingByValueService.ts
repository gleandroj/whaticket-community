import AppError from "../../errors/AppError";
import Setting from "../../models/Setting";

const ListSettingByKeyService = async (
  value: string
): Promise<Setting | undefined> => {
  const settings = await Setting.findOne({
    where: { value }
  });

  if (!settings) {
    throw new AppError("ERR_NO_API_TOKEN_FOUND", 404);
  }

  return settings;
};

export default ListSettingByKeyService;
