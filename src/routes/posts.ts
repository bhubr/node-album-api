import express from 'express';
import slug from 'slug';
import { getRepository } from 'typeorm';
import { Post } from '../entity/Post';
import { Tag } from '../entity/Tag';
import jwtMiddleware from '../middlewares/jwt';
import postController from '../controllers/post.controller';

const router = express.Router();

router.post('/', postController.create);

router.get('/', async (req, res) => {
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
});

router.get('/:id', async (req, res) => {
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
});

router.put('/:id/like', async (req, res) => {
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
});

router.delete('/:id', async (req, res) => {
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
});

export default router;
