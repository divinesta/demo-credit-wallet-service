import dotenv from 'dotenv';
import path from 'path';

import type { Knex } from 'knex';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config: Record<string, Knex.Config> = {
   development: {
      client: 'mysql2',
      connection: {
         host: process.env.DB_HOST,
         port: Number(process.env.DB_PORT ?? 3306),
         user: process.env.DB_USER,
         password: process.env.DB_PASSWORD,
         database: process.env.DB_NAME,
      },
      migrations: {
         directory: './migrations',
         extension: 'ts',
      },
   }
};

export default config;
