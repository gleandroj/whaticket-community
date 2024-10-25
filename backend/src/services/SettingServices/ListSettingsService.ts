import Setting from "../../models/Setting";

const ListSettingsService = async (
  companyId?: number
): Promise<Setting[] | undefined> => {
  const settings = await Setting.scope({
    method: ["companyId", companyId]
  }).findAll();
  return settings;
};

export default ListSettingsService;
