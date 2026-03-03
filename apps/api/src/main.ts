import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createServer } from 'node:net';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
    exposedHeaders: 'Content-Length',
  });
  const basePort = Number(process.env.PORT ?? 6000);
  const resolvePort = async (start: number) => {
    const isFree = (port: number) =>
      new Promise<boolean>((resolve) => {
        const srv = createServer();
        srv.once('error', () => resolve(false));
        srv.once('listening', () => srv.close(() => resolve(true)));
        srv.listen(port, '0.0.0.0');
      });
    for (let p = start, end = start + 20; p <= end; p++) {
      if (await isFree(p)) return p;
    }
    return start;
  };
  const port = await resolvePort(basePort);
  try {
    await app.listen(port, '0.0.0.0');
  } catch (e) {
    const err = e as { code?: string };
    if (err?.code === 'EADDRINUSE') {
      const next = await resolvePort(port + 1);
      await app.listen(next, '0.0.0.0');
    } else {
      throw new Error(String(err));
    }
  }
  console.log(`Application is running on: ${await app.getUrl()}`);
}
void bootstrap();
