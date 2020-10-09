import { Router } from 'express';
import ChannelController from '../controllers/channel.controller';
import { protect } from '../controllers/auth.controller';

const router = Router();

router.route('/').get(protect, ChannelController.getAllChannels);

router.route('/:id').get(protect, ChannelController.getChannel);

export default router;
