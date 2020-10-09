import { Request, Response } from 'express';
import * as csv from 'csv-string';
import Message from '../model/message.model';
import ChannelService from '../services/channel.service';
import MessageService from '../services/message.service';
import StockBotService from '../services/stockBot.service';
import UserService from '../services/user.service';
import HttpUtil from '../utils/http.util';
import { RequestWithBody } from '../utils/interfaces';

const httpUtil = new HttpUtil();

export interface MessageBody {
  authorId: string;
  channelId: string;
  content: string;
  token?: string;
}

const initiateStockBot = async (
  username: string,
  channelId: string,
  message: string,
) => {
  message = message.toLocaleLowerCase();

  const botUser = await UserService.getFullUser(
    process.env.STOCK_BOT_ID as string,
  );

  const sendMessageByStockBot = async (text: string) => {
    const botMessage = new Message({
      authorId: botUser?._id,
      channelId: channelId,
      content: text,
    });
    return await MessageService.createMessage(botMessage);
  };

  if (message.startsWith('/stock=')) {
    const stooqCode = message.split('/stock=')[1];

    if (stooqCode.length > 10) {
      return sendMessageByStockBot(
        `Hello, ${username}! That seems to be an invalid code. :( Please, use a valid stock code!`,
      );
    }
    sendMessageByStockBot(
      `Hello, ${username}! Let me see if I can find the current value for the "${stooqCode}" stock...`,
    );

    try {
      const stock = await StockBotService.checkStooq(stooqCode);

      const arr = csv.parse(stock.data);
      const stooqValue = arr[1][6];
      if (stooqValue === 'N/D') {
        return sendMessageByStockBot(
          `Unfortunately, I couldn't find any values for "${stooqCode}". Are you sure it's a valid stock code?`,
        );
      }
      return sendMessageByStockBot(
        `${stooqCode.toUpperCase()} quote is $${parseFloat(stooqValue).toFixed(
          2,
        )} per share.`,
      );
    } catch (err) {
      return sendMessageByStockBot(
        `There seems to be a problem with retrieving stock quotes from stooq.com :( Please, try again later.`,
      );
    }
  } else {
    return sendMessageByStockBot(
      `That's an invalid code. :( Please, use '/stock=<STOCK_CODE>' for me to tell you proper stock values!`,
    );
  }
};

class MessageController {
  static async createMessage(req: RequestWithBody<MessageBody>, res: Response) {
    if (!req.body) {
      httpUtil.setError(400, 'Incomplete info.');
      return httpUtil.send(res);
    }

    if (!req.body.authorId || !req.body.channelId || !req.body.content) {
      httpUtil.setError(400, 'Incomplete info.');
      return httpUtil.send(res);
    }

    try {
      const author = await UserService.getFullUser(
        (req.body.authorId as unknown) as string,
      );

      if (!author) {
        httpUtil.setError(401, 'Credentials invalid');
        return httpUtil.send(res);
      }

      const channel = await ChannelService.getChannelById(
        (req.body.channelId as unknown) as string,
      );

      if (!channel) {
        httpUtil.setError(401, 'Invalid channel');
        return httpUtil.send(res);
      }

      const newMessage = new Message({
        authorId: author._id,
        channelId: channel._id,
        content: req.body.content,
      });

      if (newMessage.content.startsWith('/')) {
        initiateStockBot(
          author.username as string,
          newMessage.channelId,
          newMessage.content,
        );
      } else {
        const createdMessage = await MessageService.createMessage(newMessage);
        httpUtil.setSuccess(201, 'Message Added!', createdMessage);
        return httpUtil.send(res);
      }
    } catch (error) {
      // console.log(`MessageController -> createMessage -> error`, error);
      httpUtil.setError(400, error);
      return httpUtil.send(res);
    }
  }

  static async getMessage(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const message = await MessageService.getMessageById(id);

      if (!message) {
        httpUtil.setError(404, `Cannot find a message with id ${id}.`);
      } else {
        httpUtil.setSuccess(200, 'Message found.', message);
      }
      return httpUtil.send(res);
    } catch (error) {
      httpUtil.setError(404, error);
      return httpUtil.send(res);
    }
  }

  static async getAllMessages(req: any, res: any) {
    try {
      const allMessages = await MessageService.getMessages();
      if (allMessages.length > 0) {
        httpUtil.setSuccess(200, 'Messages retrieved.', allMessages);
      } else {
        httpUtil.setSuccess(200, 'No messages found.');
      }
      return httpUtil.send(res);
    } catch (error) {
      httpUtil.setError(400, error);
      return httpUtil.send(res);
    }
  }

  static async getMessagesByChannel(req: any, res: any) {
    const { channelId } = req.params;

    try {
      const allMessages = await MessageService.getMessagesByChannel(channelId);

      const resMessagesPromises = allMessages.map(async (message) => {
        const user = await UserService.getUserById(message.authorId);
        const m = {
          _id: message._id,
          authorId: message.authorId,
          channel: message.channelId,
          content: message.content,
          createAt: message.createAt,
          updatedAt: message.updatedAt,
        };
        return {
          ...m,
          username: user ? user.username : '[USER DELETED]',
        };
      });
      const resMessages = await Promise.all(resMessagesPromises);

      if (resMessages.length > 0) {
        httpUtil.setSuccess(200, 'Messages retrieved.', resMessages);
      } else {
        httpUtil.setSuccess(200, 'No messages found.');
      }
      return httpUtil.send(res);
    } catch (error) {
      httpUtil.setError(400, error);
      return httpUtil.send(res);
    }
  }
}

export default MessageController;
