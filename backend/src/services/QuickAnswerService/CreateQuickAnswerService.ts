import AppError from "../../errors/AppError";
import QuickAnswer from "../../models/QuickAnswer";

interface Request {
  shortcut: string;
  message: string;
  companyId: number;
}

const CreateQuickAnswerService = async ({
  shortcut,
  message,
  companyId
}: Request): Promise<QuickAnswer> => {
  const nameExists = await QuickAnswer.findOne({
    where: { shortcut }
  });

  if (nameExists) {
    throw new AppError("ERR__SHORTCUT_DUPLICATED");
  }

  const quickAnswer = await QuickAnswer.create({
    shortcut,
    message,
    companyId
  });

  return quickAnswer;
};

export default CreateQuickAnswerService;
