import { Request, Response } from 'express';
import Message, { IMessage } from '../model/message.model';
import ChannelService from '../services/channel.service';
import MessageService from '../services/message.service';
import UserService from '../services/user.service';
import HttpUtil from '../utils/http.util';
import { RequestWithBody } from '../utils/interfaces';

const httpUtil = new HttpUtil();

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

      channel.creator = author;

      const newMessage = new Message({
        author: author,
        channel: channel,
        content: req.body.content,
      });

      const createdMessage = await MessageService.createMessage(newMessage);

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
}

export default MessageController;
