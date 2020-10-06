import { Router } from 'express';
import UserController from '../controllers/user.controller';
// import { protect } from '../controllers/auth.controller';

const router = Router();

// router.route('/').post(protect, UserController.createUser);
router.route('/').post(UserController.createUser);

export default router;
