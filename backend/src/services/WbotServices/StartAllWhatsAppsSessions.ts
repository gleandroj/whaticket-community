import { logger } from "../../utils/logger";
import ListWhatsAppsService from "../WhatsappService/ListWhatsAppsService";
import { StartWhatsAppSession } from "./StartWhatsAppSession";

export const StartAllWhatsAppsSessions = async (): Promise<void> => {
  const whatsapps = await ListWhatsAppsService();
  if (whatsapps.length > 0) {
    whatsapps.forEach(whatsapp => {
      logger.info(`Starting session for ${whatsapp.name}`);
      StartWhatsAppSession(whatsapp);
    });
  }
};
