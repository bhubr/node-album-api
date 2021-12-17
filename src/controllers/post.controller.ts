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
      console.error('Error while creating post', err.message);
      return res.status(500).json({
        error: err.message,
      });
    }
  },

  async findAll(req, res) {
    try {
      const postRepository = getRepository(Post);
      const posts: Post[] = await postRepository.find({
        relations: ['tags']
      });
      res.send(posts);
    } catch (err) {
      console.error('Error while requesting posts', err.message);
      return res.status(500).json({
        error: err.message,
      });
    }
  },

  async findOne(req, res) {
    try {
      const postId = Number(req.params.id);
      const postRepository = getRepository(Post);
      const post: Post = await postRepository.findOne(postId);
      if (!post) {
        return res.status(404).send({
          error: `post with id ${postId} not found`
        });
      }
      return res.send(post);
    } catch (err) {
      console.error('Error while requesting post', err.message);
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
      console.error('Error while requesting post', err.message);
      return res.status(500).json({
        error: err.message,
      });
    }
  },

  async delete(req, res) {
    try {
      const postId = Number(req.params.id);
      const postRepository = getRepository(Post);
      const { affected } = await postRepository.delete(postId);
      if (affected === 0) {
        return res.status(404).send({
          error: `post with id ${postId} not found`
        });
      }
      return res.sendStatus(204);
    } catch (err) {
      console.error('Error while requesting post', err.message);
      return res.status(500).json({
        error: err.message,
      });
    }
  }
}
