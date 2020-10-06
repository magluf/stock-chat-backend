export default class HttpUtil {
  statusCode: number | null;
  type: string | null;
  data: any;
  message: string | null;

  constructor() {
    this.statusCode = null;
    this.type = null;
    this.data = null;
    this.message = null;
  }

  setSuccess(
    statusCode: number | null,
    message: string | null,
    data?: any | null,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.type = 'success';
  }

  setError(statusCode: number | null, message: any) {
    if (message.code === 11000) {
      if (Object.prototype.hasOwnProperty.call(message.keyValue, 'username')) {
        message = `Username '${message.keyValue.username}' already in use.`;
      } else if (
        Object.prototype.hasOwnProperty.call(message.keyValue, 'email')
      ) {
        message = `Email '${message.keyValue.email}' already in use.`;
      } else if (
        Object.prototype.hasOwnProperty.call(message.keyValue, 'name')
      ) {
        message = `Channel name '${message.keyValue.name}' already exists.`;
      }
    }

    this.statusCode = statusCode;
    this.message = message;
    this.type = 'error';
  }

  send(res: any) {
    const result = {
      status: this.type,
      message: this.message,
      data: this.data,
    };

    if (this.type === 'success') {
      return res.status(this.statusCode).json(result);
    }
    return res.status(this.statusCode).json({
      status: this.type,
      message: this.message,
    });
  }
}
