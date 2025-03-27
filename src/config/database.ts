import { registerAs } from '@nestjs/config';

const { DB_PORT, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, NODE_ENV } =
  process.env;
const intDbPort = parseInt(DB_PORT!);

export default registerAs('database', () => ({
  type: 'postgres',
  host: DB_HOST || 'localhost',
  port: intDbPort || 5432,
  username: DB_USERNAME || 'postgres',
  password: DB_PASSWORD || 'postgres',
  database: DB_DATABASE || 'nestjs',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: NODE_ENV !== 'production',
}));
