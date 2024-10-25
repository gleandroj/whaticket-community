import AppError from "../errors/AppError";
import Whatsapp from "../models/Whatsapp";
import GetDefaultWhatsAppByUser from "./GetDefaultWhatsAppByUser";

const GetDefaultWhatsApp = async (
  userId?: number,
  companyId?: number
): Promise<Whatsapp> => {
  const whatsapp = await GetDefaultWhatsAppByUser(userId, companyId);
  if (whatsapp !== null) {
    return whatsapp;
  }
  throw new AppError("ERR_NO_DEF_WAPP_FOUND");
};

export default GetDefaultWhatsApp;
