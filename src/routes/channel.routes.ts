import { Router } from 'express';
import ChannelController from '../controllers/channel.controller';
import { protect } from '../controllers/auth.controller';

const router = Router();

router
  .route('/')
  .post(protect, ChannelController.createChannel)
  .get(protect, ChannelController.getAllChannels);

router.route('/:id').get(protect, ChannelController.getChannel);

export default router;
