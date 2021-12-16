import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { createConnection, Connection } from 'typeorm';
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
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use('/api', apiRouter);

export default app;

export function initializeConnection(): Promise<Connection> {
  return createConnection();
}
