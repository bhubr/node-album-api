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

router.get('/:slug/*', async (req, res) => {
  try {
    const { slug } = req.params;
    const bits = req.url.split('/');
    while(bits.shift() !== slug) {}
    const postRepository = getRepository(Post);
    const posts: Post[] = await postRepository.find({ slug });
    if (!posts.length) {
      return res.status(404).send({
        error: `post "${slug}" not found`
      })
    }
    const [post] = posts;
    const postFile = join(postsRoot, slug, ...bits);
    return res.sendFile(postFile);
  } catch (err) {
    console.error('Error while requesting posts', err.message);
    return res.status(500).json({
      error: err.message,
    });
  }
});

export default router;
