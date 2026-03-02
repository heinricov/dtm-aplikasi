import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createServer } from 'node:net';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
void bootstrap();
