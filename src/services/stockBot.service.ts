import axios from 'axios';
import Message, { IMessage } from '../model/message.model';

class StockBotService {
  static async createStockBotMessage(newMessage: IMessage) {
    return await Message.create(newMessage);
  }

  static async checkStooq(stockCode: string) {
    const code = stockCode.trim().toLowerCase();
    return await axios.get(
      `https://stooq.com/q/l/?s=${code}&f=sd2t2ohlcv&h&e=csv`,
    );
  }
}

export default StockBotService;
