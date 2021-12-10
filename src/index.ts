import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { createConnection } from 'typeorm';
import { Post } from './entity/Post';

import './env';
import apiRouter from './routes';

const app = express();
app.use(
  cors({
    credentials: true,
    origin: [process.env.CLIENT_APP_ORIGIN],
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api', apiRouter);

async function bootstrap() {
  const connection = await createConnection();

  // const repository = connection.getRepository(Post);

  // const book = new Book();
  // book.title = 'The Kubernetes Workshop';
  // book.slug = 'the-kubernetes-workshop';
  // book.coverPicture = 'https://static.packt-cdn.com/products/9781838820756/cover/9781838820756-original.png';
  // await repository.save(book);

  const port = process.env.PORT;
  app.listen(port, () => console.log(`Listening on ${port}`));
}

bootstrap().catch((error) => console.log(error));
