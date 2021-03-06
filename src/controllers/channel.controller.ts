import { Request, Response } from 'express';
import Channel, { IChannel } from '../model/channel.model';
import ChannelService from '../services/channel.service';
import HttpUtil from '../utils/http.util';
import { RequestWithBody } from '../utils/interfaces';

const httpUtil = new HttpUtil();

class ChannelController {
  static async createChannel(req: RequestWithBody<IChannel>, res: Response) {
    if (!req.body) {
      httpUtil.setError(400, 'Incomplete info.');
      return httpUtil.send(res);
    }

    if (!req.body.name || !req.body.details) {
      httpUtil.setError(400, 'Incomplete info.');
      return httpUtil.send(res);
    }

    try {
      const newChannel = new Channel({
        name: req.body.name,
        details: req.body.details,
      });

      const createdChannel = await ChannelService.createChannel(newChannel);

      httpUtil.setSuccess(201, 'Channel Added!', createdChannel);
      return httpUtil.send(res);
    } catch (error) {
      httpUtil.setError(400, error);
      return httpUtil.send(res);
    }
  }

  static async getChannel(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const channel = await ChannelService.getChannelById(id);

      if (!channel) {
        httpUtil.setError(404, `Cannot find a channel with id ${id}.`);
      } else {
        httpUtil.setSuccess(200, 'Channel found.', channel);
      }
      return httpUtil.send(res);
    } catch (error) {
      httpUtil.setError(404, error);
      return httpUtil.send(res);
    }
  }

  static async getAllChannels(req: any, res: any) {
    try {
      const allChannels = await ChannelService.getChannels();
      if (allChannels.length > 0) {
        httpUtil.setSuccess(200, 'Channels retrieved.', allChannels);
      } else {
        httpUtil.setSuccess(200, 'No channels found.');
      }
      return httpUtil.send(res);
    } catch (error) {
      httpUtil.setError(400, error);
      return httpUtil.send(res);
    }
  }
}

export default ChannelController;
