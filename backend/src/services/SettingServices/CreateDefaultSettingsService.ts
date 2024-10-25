import { v4 as uuidv4 } from "uuid";
import Setting from "../../models/Setting";

interface Request {
  companyId: number;
}

interface Data {
  companyId: number;
  key: string;
  value: string;
}

const CreateDefaultSettingsService = async ({
  companyId
}: Request): Promise<void> => {
  const settings: Data[] = [
    {
      companyId,
      key: Setting.USER_CREATION_KEY,
      value: "enabled"
    },
    {
      companyId,
      key: Setting.USER_API_TOKEN_KEY,
      value: uuidv4()
    }
  ];

  await Setting.bulkCreate(settings);
};

export default CreateDefaultSettingsService;
