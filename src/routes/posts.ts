import express from 'express';
import { join } from 'path';
import slug from 'slug';
import { getRepository } from 'typeorm';
import { Post } from '../entity/Post';

const postsRoot = process.env.BOOKS_PATH;

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const postRepository = getRepository(Post);
    const postSlug = slug(req.body.title);
    const post = postRepository.create({
      ...req.body,
      slug: postSlug,
    });
    // console.log(posts);
    await postRepository.save(post);
    res.send(post);
  } catch (err) {
    console.error('Error while creating post', err.message);
    return res.status(500).json({
      error: err.message,
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const postRepository = getRepository(Post);
    const posts: Post[] = await postRepository.find();
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
