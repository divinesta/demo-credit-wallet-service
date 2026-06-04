import dotenv from 'dotenv';
import path from 'path';

import type { Knex } from 'knex';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const connection = (database: string | undefined): Knex.MySql2ConnectionConfig => ({
   host: process.env.DB_HOST,
   port: Number(process.env.DB_PORT ?? 3306),
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database,
});

const config: Record<string, Knex.Config> = {
   development: {
      client: 'mysql2',
      connection: connection(process.env.DB_NAME),
      migrations: {
         directory: './src/database/migrations',
         extension: 'ts',
      },
   },
   test: {
      client: 'mysql2',
      connection: connection(process.env.TEST_DB_NAME ?? process.env.DB_NAME),
      migrations: {
         directory: './src/database/migrations',
         extension: 'ts',
      },
   },
};

export default config;
