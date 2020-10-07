import { Router } from 'express';
import MessageController from '../controllers/message.controller';
import { protect } from '../controllers/auth.controller';

const router = Router();

router
  .route('/')
  .post(protect, MessageController.createMessage)
  .get(protect, MessageController.getAllMessages);

router.route('/:id').get(protect, MessageController.getMessage);

export default router;
