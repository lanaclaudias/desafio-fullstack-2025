import { DataSource } from 'typeorm';
import { join } from 'path';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: join(process.cwd(), 'data', 'database.sqlite'),
  synchronize: true,
  logging: false,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
});

export default AppDataSource;
