import { use } from 'chai';
import { getRepository } from 'typeorm';

import { Post } from '../entity/Post';
import postService from '../services/post.service';

export default {
  async create(req, res) {
    try {
      const userId = req?.user?.id;
      const { title, description, picture, tags } = req.body;
      const post = await postService.createPost({
        userId, title, description, picture, tags
      });
      res.status(201).send(post);
    } catch (err) {
      console.error('Error while creating post', err);
      return res.status(500).json({
        error: err.message,
      });
    }
  },

  async findAll(req, res) {
    try {
      const postRepository = getRepository(Post);
      const posts: Post[] = await postRepository.find({
        relations: ['tags', 'user']
      });
      const postsWithMappedUser = posts.map(({ user, ...p }) => ({
        ...p,
        user: user && {
          id: user.id, email: user.email, avatar: user.avatar,
        }
      }))
      res.send(postsWithMappedUser);
    } catch (err) {
      console.error('Error while requesting posts', err);
      return res.status(500).json({
        error: err.message,
      });
    }
  },

  async findOne(req, res) {
    try {
      const postId = Number(req.params.id);
      if (Number.isNaN(postId)) {
        return res.status(400).send({
          errors: [
            { message: `Invalid post id ${req.params.id}` }
          ]
        })
      }
      const postRepository = getRepository(Post);
      const post: Post = await postRepository.findOne(postId, {
        relations: ['tags', 'user']
      });
      if (!post) {
        return res.status(404).send({
          error: `post with id ${postId} not found`
        });
      }
      delete post.user.password;
      delete post.user.githubId;
      return res.send(post);
    } catch (err) {
      console.error('Error while requesting post', err);
      return res.status(500).json({
        error: err.message,
      });
    }
  },

  async like(req, res) {
    try {
      const postId = Number(req.params.id);
      const postRepository = getRepository(Post);
      const post: Post = await postRepository.findOne(postId);
      if (!post) {
        return res.status(404).send({
          error: `post with id ${postId} not found`
        });
      }
      post.likes += 1;
      await postRepository.save(post);
      return res.send(post);
    } catch (err) {
      console.error('Error while liking post', err);
      return res.status(500).json({
        error: err.message,
      });
    }
  },

  async delete(req, res) {
    try {
      const postId = Number(req.params.id);
      const postRepository = getRepository(Post);
      const post: Post = await postRepository.findOne(postId, {
        relations: ['user'],
      });
      if (!post) {
        return res.status(404).send({
          error: `post with id ${postId} not found`
        });
      }
      if (req.user.id !== post.user.id) {
        return res.status(403).send({
          error: 'This post belongs to another user'
        });
      }
      await postRepository.delete(postId);
      return res.sendStatus(204);
    } catch (err) {
      console.error('Error while deleting post', err);
      return res.status(500).json({
        error: err.message,
      });
    }
  }
}
