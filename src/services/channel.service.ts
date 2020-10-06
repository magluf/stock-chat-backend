import Channel, { IChannel } from '../model/channel.model';

class ChannelService {
  static async createChannel(newChannel: IChannel) {
    return await Channel.create(newChannel);
  }

  static async getChannels() {
    return await Channel.find();
  }

  static async getChannelById(id: string) {
    return await Channel.findById(id);
  }

  static async getChannelByName(name: string) {
    return await Channel.findOne({ name });
  }
}

export default ChannelService;
