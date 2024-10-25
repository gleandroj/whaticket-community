import Queue from "../../models/Queue";
import Whatsapp from "../../models/Whatsapp";

const ListWhatsAppsService = async (
  companyId?: number
): Promise<Whatsapp[]> => {
  const whatsapps = await Whatsapp.scope([
    { method: ["companyId", companyId] }
  ]).findAll({
    include: [
      {
        model: Queue,
        as: "queues",
        attributes: ["id", "name", "color", "greetingMessage"]
      }
    ]
  });

  return whatsapps;
};

export default ListWhatsAppsService;
