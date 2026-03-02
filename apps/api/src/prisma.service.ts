import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'prisma/generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        'DATABASE_URL tidak terdefinisi. Set variabel lingkungan sebelum menjalankan server.',
      );
    }
    const adapter = new PrismaPg({
      connectionString: url,
    });
    super({ adapter });
  }
}
