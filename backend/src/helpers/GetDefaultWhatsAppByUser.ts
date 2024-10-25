import User from "../models/User";
import Whatsapp from "../models/Whatsapp";
import { logger } from "../utils/logger";

const GetDefaultWhatsAppByUser = async (
  userId?: number,
  companyId?: number
): Promise<Whatsapp | null> => {
  if (userId) {
    const user = await User.findByPk(userId, { include: ["whatsapp"] });
    if (user === null) {
      return null;
    }

    if (user.whatsapp !== null) {
      logger.info(
        `Found whatsapp linked to user '${user.name}' is '${user.whatsapp.name}'.`
      );
    }

    return user.whatsapp;
  }

  if (companyId) {
    const defaultWhatsapp = await Whatsapp.findOne({
      where: { companyId, isDefault: true }
    });

    if (defaultWhatsapp) {
      logger.info(`Found default whatsapp for company #${companyId}.`);
      return defaultWhatsapp;
    }
  }

  logger.error("No default whatsapp found.");
  return null;
};

export default GetDefaultWhatsAppByUser;
