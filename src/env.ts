import dotenv from 'dotenv';
import { resolve } from 'path';

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
const envPath = resolve(__dirname, '..', envFile);

dotenv.config({
  path: envPath
});
