import { getRepository } from 'typeorm';

import { User } from '../entity/User';
import { Post } from '../entity/Post';
import { Comment } from '../entity/Comment';
import { Notification, NotificationType } from '../entity/Notification';
import WebSocketHandler from '../ws';

export default {
  async findAll(req, res) {
    try {
      const { id: userId } = (req.user as User);
      const userRepository = getRepository(User);
      const user: User = await userRepository.findOne(userId, {
        relations: ['notifications']
      });
      res.send(user.notifications);
    } catch (err) {
      console.error('Error while creating comment', err);
      return res.status(500).json({
        error: err.message,
      });
    }
  },
}