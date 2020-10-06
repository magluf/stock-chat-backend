import { Response } from 'express';
import User, { IUser } from '../model/user.model';
import UserService from '../services/user.service';
import HttpUtil from '../utils/http.util';
import { RequestWithBody } from '../utils/interfaces';

const httpUtil = new HttpUtil();

class UserController {
  static async createUser(req: RequestWithBody<IUser>, res: Response) {
    if (!req.body) {
      httpUtil.setError(400, 'Incomplete info.');
      return httpUtil.send(res);
    }

    if (!req.body.email || !req.body.password || !req.body.username) {
      httpUtil.setError(400, 'Incomplete info.');
      return httpUtil.send(res);
    }

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordChangedAt: undefined,
      salt: '',
    });

    try {
      const createdUser = await UserService.createUser(newUser);

      createdUser.password = undefined;
      createdUser.salt = undefined;

      httpUtil.setSuccess(201, 'User Added!', createdUser);
      return httpUtil.send(res);
    } catch (error) {
      httpUtil.setError(400, error);
      return httpUtil.send(res);
    }
  }
}

export default UserController;
