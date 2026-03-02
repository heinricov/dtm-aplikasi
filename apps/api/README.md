Stack

1. NestJS
2. Prisma
3. PostgreSQL

Prisma Setup

1. Install dependencies

   ```bash
   npm install prisma --save-dev
   npm install @prisma/client @prisma/adapter-pg pg dotenv

   ```

2. Inisialisasi Prisma

   ```bash
   npx prisma init --db --output ./generated/prisma

   ```

3. Konfigurasi schema di [prisma/schema.prisma ](prisma/schema.prisma)

4. Jalankan migrasi dan generate client

   ```bash
   npx prisma migrate dev --name init
   npx prisma generate

   ```

5. Buat file src/prisma.service.ts untuk service Prisma

   ```typescript
   import { Injectable } from '@nestjs/common';
   import { PrismaPg } from '@prisma/adapter-pg';
   import { PrismaClient } from 'prisma/generated/prisma/client';

   @Injectable()
   export class PrismaService extends PrismaClient {
     constructor() {
       const adapter = new PrismaPg({
         connectionString: process.env.DATABASE_URL as string,
       });
       super({ adapter });
     }
   }
   ```
