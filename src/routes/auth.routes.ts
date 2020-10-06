import { Router } from 'express';
import AuthController, { protect } from '../controllers/auth.controller';

const router = Router();

router.route('/login').post(AuthController.login);
router.route('/logout').get(AuthController.logout);
router.route('/').get(protect, AuthController.isLoggedIn); //Genius

export default router;
