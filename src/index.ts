import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import app, { initializeConnection } from './app';
import WebSocketHandler from './ws';

async function bootstrap() {
  await initializeConnection();
  const port = process.env.PORT;
  const server = createServer(app);
  const wss = new WebSocketServer({ server });
  const wsHandler = WebSocketHandler.getInstance();
  wss.on('connection', wsHandler.onConnect);
  server.listen(port, () => console.log(`Listening on ${port}`));
}

bootstrap().catch((error) => console.log(error));
