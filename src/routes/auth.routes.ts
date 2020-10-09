import { NextFunction, Request, Response, Router } from 'express';
import AuthController, { protect } from '../controllers/auth.controller';

const router = Router();

const checkIfHeroku = (req: Request, res: Response, next: NextFunction) => {
  if (req.query.heroku) {
    res.locals.heroku = true;
  }
  next();
};

router.route('/login').post(checkIfHeroku, AuthController.login);
router.route('/logout').get(AuthController.logout);
router.route('/check').get(protect, AuthController.isLoggedIn); //Genius

export default router;
