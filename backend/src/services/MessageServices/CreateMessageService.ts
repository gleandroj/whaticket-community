import { getIO } from "../../libs/socket";
import Message from "../../models/Message";
import Ticket from "../../models/Ticket";
import Whatsapp from "../../models/Whatsapp";

interface MessageData {
  id: string;
  ticketId: number;
  body: string;
  contactId?: number;
  fromMe?: boolean;
  read?: boolean;
  mediaType?: string;
  mediaUrl?: string;
  companyId: number;
}
interface Request {
  messageData: MessageData;
}

const CreateMessageService = async ({
  messageData
}: Request): Promise<Message> => {
  await Message.upsert(messageData);

  const message = await Message.findByPk(messageData.id, {
    include: [
      "contact",
      {
        model: Ticket,
        as: "ticket",
        include: [
          "contact",
          "queue",
          {
            model: Whatsapp,
            as: "whatsapp",
            attributes: ["name"]
          }
        ]
      },
      {
        model: Message,
        as: "quotedMsg",
        include: ["contact"]
      }
    ]
  });

  if (!message) {
    throw new Error("ERR_CREATING_MESSAGE");
  }

  const io = getIO(message.companyId);
  const payload = {
    action: "create",
    message,
    ticket: message.ticket,
    contact: message.ticket.contact
  };

  io.to(`chatBox:${message.ticketId}`).emit("chatBoxMessage", payload);
  io.to(`tickets:${message.ticket.status}`).emit("ticketMessage", payload);
  io.to("notification").emit("notificationMessage", payload);

  return message;
};

export default CreateMessageService;
