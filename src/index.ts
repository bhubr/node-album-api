import app, { initializeConnection } from './app';

async function bootstrap() {
  await initializeConnection();
  const port = process.env.PORT;
  app.listen(port, () => console.log(`Listening on ${port}`));
}

bootstrap().catch((error) => console.log(error));
