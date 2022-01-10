import { getRepository } from 'typeorm';

import { User } from '../entity/User';
import { Post } from '../entity/Post';
import { Comment } from '../entity/Comment';
import { Notification, NotificationType } from '../entity/Notification';
import WebSocketHandler from '../ws';

export default {
  async create(req, res) {
    try {
      const userId = req?.user?.id;
      const { postId } = req.params;
      const { text } = req.body;
      const postRepository = getRepository(Post);
      const post: Post = await postRepository.findOne(postId, {
        relations: ['user']
      });
      if (!post) {
        return res.status(404).send({
          error: `post with id ${postId} not found`
        });
      }
      const commentRepository = getRepository(Comment);
      const comment: Comment = commentRepository.create({
        text
      })
      const userRepository = getRepository(User);
      comment.post = post;
      const user = await userRepository.findOne(userId);
      if (!user) {
        return res.status(404).send({
          error: `user with id ${userId} not found`
        });
      }
      comment.user = user;
      await commentRepository.save(comment);
      delete comment.user.password;
      delete comment.post.user.password;
      const notifRepository = getRepository(Notification);
      const notif = notifRepository.create({
        user,
        type: NotificationType.COMMENT,
        data: JSON.stringify({ user: req.user, post })
      })
      await notifRepository.save(notif);
      await WebSocketHandler.getInstance().notifyComment(post.user.id, comment.user, post);
      res.status(201).send(comment);
    } catch (err) {
      console.error('Error while creating post', err);
      return res.status(500).json({
        error: err.message,
      });
    }
  },

  async findAll(req, res) {
    try {
      const { postId } = req.params;
      const postRepository = getRepository(Post);
      const post: Post = await postRepository.findOne(postId, {
        relations: ['user']
      });
      if (!post) {
        return res.status(404).send({
          error: `post with id ${postId} not found`
        });
      }
      const commentRepository = getRepository(Comment);
      const comments = commentRepository.find({
        post
      })
      return comments;
    } catch (err) {
      console.error('Error while creating comment', err);
      return res.status(500).json({
        error: err.message,
      });
    }
  },

  async delete(req, res) {
    try {
      const { postId, commentId } = req.params;
      const postRepository = getRepository(Post);
      const post: Post = await postRepository.findOne(postId, {
        relations: ['user']
      });
      if (!post) {
        return res.status(404).send({
          error: `post with id ${postId} not found`
        });
      }
      const commentRepository = getRepository(Comment);
      await commentRepository.delete(commentId);
      return res.sendStatus(204);
    } catch (err) {
      console.error('Error while deleting comment', err);
      return res.status(500).json({
        error: err.message,
      });
    }
  }
}