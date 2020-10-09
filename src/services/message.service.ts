import Message, { IMessage } from '../model/message.model';

class MessageService {
  static async createMessage(newMessage: IMessage) {
    return await Message.create(newMessage);
  }

  static async getMessages() {
    return await Message.find();
  }

  static async getMessagesByChannel(channelId: string): Promise<IMessage[]> {
    // return await Message.find()
    return await Message.find({ channelId: channelId })
      .sort('-createdAt')
      .limit(50);
  }

  static async getMessageById(id: string) {
    return await Message.findById(id);
  }

  static async getMessageByName(name: string) {
    return await Message.findOne({ name });
  }
}

export default MessageService;
