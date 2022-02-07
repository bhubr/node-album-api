import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { resolve } from 'path';
import cookieParser from 'cookie-parser';
import { createConnection, Connection } from 'typeorm';
import { Post } from './entity/Post';

import './env';
import apiRouter from './routes';

const app = express();
const avatarsDir = resolve(__dirname, '..', 'public');
app.use(
  cors({
    credentials: true,
    origin: [process.env.CLIENT_APP_ORIGIN],
  })
);
app.use(express.json());
app.use(express.static(avatarsDir));
app.use(cookieParser());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use('/api', apiRouter);

const docsRoot = process.env.DOCS_ROOT;
if (docsRoot) {
  const isAbsolute = docsRoot.startsWith('/');
  const docsPath = isAbsolute ? docsRoot : resolve(__dirname, docsRoot);
  app.use(express.static(docsPath));
}

app.use(function(err, req, res, next) {
  if(err.name === 'UnauthorizedError') {
    res.status(err.status).send({ message:err.message });
    return;
  }
  next();
});

export default app;

export function initializeConnection(): Promise<Connection> {
  return createConnection();
}
