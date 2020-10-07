import { Request, Response } from 'express';
import * as csvString from 'csv-string';
import csvParser from 'csv-parser';
// import fastCsv from 'fast-csv';
import { IChannel } from '../model/channel.model';
import Message, { IMessage } from '../model/message.model';
import ChannelService from '../services/channel.service';
import MessageService from '../services/message.service';
import StockBotService from '../services/stockBot.service';
import UserService from '../services/user.service';
import HttpUtil from '../utils/http.util';
import { RequestWithBody } from '../utils/interfaces';

const httpUtil = new HttpUtil();

/*
{
    "_id": "5f7d6a05151b8d1f19f21833",
    "username": "StockBot",
    "email": "stock@bot.app",
    "createdAt": "2020-10-07T07:11:01.711Z",
    "updatedAt": "2020-10-07T07:11:01.711Z",
    "__v": 0
}
*/

const initiateStockBot = async (
  author: string,
  channel: IChannel,
  message: string,
) => {
  const botUser = await UserService.getFullUser(
    process.env.STOCK_BOT_ID as string,
  );
  const botMessage = new Message({
    author: botUser,
    channel: channel,
    content: '',
  });

  if (message.startsWith('/stock=')) {
    const stooqCode = message.split('/stock=')[1];
    console.log('stooqCode', stooqCode);

    if (stooqCode.length > 10) {
      botMessage.content = `Hello, ${author}! That seems to be an invalid code. :( Please, use a valid stock code!`;
      return await MessageService.createMessage(botMessage);
    }
    console.log('author', author);
    botMessage.content = `Hello, ${author}! Let me see if I can find that for you...`;
    await MessageService.createMessage(botMessage);

    try {
      const stock = await StockBotService.checkStooq(stooqCode);
      console.log('stock', stock);

      // const results = [];

      const csvP = csvParser(stock.data);
      console.log('csvP', csvP);
      const csvS = csvString.parse(stock.data);
      console.log('csvS', csvS);
    } catch (err) {
      console.log('err', err);
    }
  }

  await MessageService.createMessage(botMessage);
};

class MessageController {
  static async createMessage(req: RequestWithBody<IMessage>, res: Response) {
    if (!req.body) {
      httpUtil.setError(400, 'Incomplete info.');
      return httpUtil.send(res);
    }

    if (!req.body.author || !req.body.channel || !req.body.content) {
      httpUtil.setError(400, 'Incomplete info.');
      return httpUtil.send(res);
    }

    try {
      const author = await UserService.getFullUser(
        (req.body.author as unknown) as string,
      );

      if (!author) {
        httpUtil.setError(401, 'Credentials invalid');
        return httpUtil.send(res);
      }

      const channel = await ChannelService.getChannelById(
        (req.body.channel as unknown) as string,
      );

      if (!channel) {
        httpUtil.setError(401, 'Invalid channel');
        return httpUtil.send(res);
      }

      const newMessage = new Message({
        author: author,
        channel: channel,
        content: req.body.content,
      });

      console.log('MessageController -> createMessage -> author', author);
      const createdMessage = await MessageService.createMessage(newMessage);
      if (newMessage.content.startsWith('/')) {
        initiateStockBot(
          newMessage.author.username as string,
          newMessage.channel,
          newMessage.content,
        );
      }

      createdMessage.author.password = undefined;
      createdMessage.author.salt = undefined;
      createdMessage.author.email = undefined;
      createdMessage.author.username = undefined;

      createdMessage.channel.creator = undefined;

      httpUtil.setSuccess(201, 'Message Added!', createdMessage);
      return httpUtil.send(res);
    } catch (error) {
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
}

export default MessageController;
