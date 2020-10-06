// import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { Response, CookieOptions, Request } from 'express';
import UserService from '../services/user.service';
import { isDecryptionValid } from '../utils/encrypt.util';
import HttpUtil from '../utils/http.util';
import { RequestWithBody } from '../utils/interfaces';

const httpUtil = new HttpUtil();

interface ILoginInfo {
  username: string;
  password: string;
}

const jwtToken = (id: number) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const decodeJwt = (token: string) => {
  return promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET as string,
  ) as Promise<{ id: string; iat: number; exp: number }>;
};

const checkForChangedPassword = (
  jwtTimeStamp: number,
  passwordChangedAt: Date | undefined,
) => {
  if (passwordChangedAt) {
    const changedAt = passwordChangedAt.getTime() / 1000;
    return changedAt > jwtTimeStamp;
  }
  return false;
};

export const protect = async (req: any, res: any, next: any) => {
  const { authorization } = req.headers;
  let token;
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  } else if (req.headers.cookie) {
    token = req.headers.cookie.split('jwt=')[1];
  }

  if (!token) {
    httpUtil.setError(401, 'Not logged in.');
    return httpUtil.send(res);
  }

  try {
    const decoded = await decodeJwt(token);
    console.log('protect -> decoded', decoded);

    const user = await UserService.getUserById(decoded.id);
    console.log('protect -> user', user);
    if (!user) {
      httpUtil.setError(401, 'Invalid credentials.');
      return httpUtil.send(res);
    }

    const { passwordChangedAt } = user;

    if (checkForChangedPassword(decoded.iat, passwordChangedAt)) {
      httpUtil.setError(401, 'Invalid credentials.');
      return httpUtil.send(res);
    }

    next();
  } catch (error) {
    httpUtil.setError(401, error);
    return httpUtil.send(res);
  }
};

class AuthController {
  static async login(req: RequestWithBody<ILoginInfo>, res: Response) {
    const { username, password } = req.body;
    if (!username || !password) {
      httpUtil.setError(400, 'Incomplete info.');
      return httpUtil.send(res);
    }

    try {
      const user = await UserService.getUserByUsername(username);
      if (!user) {
        httpUtil.setError(401, 'Credentials invalid');
        return httpUtil.send(res);
      }

      if (
        await isDecryptionValid(
          password,
          user.salt as string,
          user.password as string,
        )
      ) {
        const token = jwtToken(user.id);

        const cookieOptions: CookieOptions = {
          expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          secure: process.env.NODE_ENV === 'production',
          // secure: false,
          httpOnly: true,
        };

        res.cookie('jwt', token, cookieOptions);
        httpUtil.setSuccess(201, 'User logged in!', {
          id: user._id,
          username: user.username,
          email: user.email,
        });
        return httpUtil.send(res);
      }

      httpUtil.setError(401, 'Credentials invalid.');
      return httpUtil.send(res);
    } catch (error) {
      httpUtil.setError(400, error);
      return httpUtil.send(res);
    }
  }

  static async logout(req: Request, res: Response) {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    httpUtil.setSuccess(200, 'User logged out!');
    return httpUtil.send(res);
  }

  static async isLoggedIn(req: Request, res: Response) {
    const { authorization } = req.headers;
    let token;
    if (authorization && authorization.startsWith('Bearer')) {
      token = authorization.split(' ')[1];
    } else if (req.headers.cookie) {
      token = req.headers.cookie.split('jwt=')[1];
    }

    if (!token) {
      httpUtil.setError(401, 'Not logged in.');
      return httpUtil.send(res);
    }

    try {
      const decoded = await decodeJwt(token);

      const user = await UserService.getUserById(decoded.id);
      if (!user) {
        httpUtil.setError(401, 'Invalid credentials.');
        return httpUtil.send(res);
      }

      const { passwordChangedAt } = user;

      if (checkForChangedPassword(decoded.iat, passwordChangedAt)) {
        httpUtil.setError(401, 'Invalid credentials.');
        return httpUtil.send(res);
      }

      httpUtil.setSuccess(200, 'User logged in!', user);
      return httpUtil.send(res);
    } catch (error) {
      httpUtil.setError(401, error);
      return httpUtil.send(res);
    }
  }
}

export default AuthController;
