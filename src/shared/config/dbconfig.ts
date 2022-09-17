import { SupermarketEntity } from '../../supermarket/supermarket.entity';
import { CityEntity } from '../../city/city.entity';

export const dbCongif: object = {
  type: process.env.DB_TYPE ? process.env.DB_TYPE : 'postgres',
  host: process.env.DB_HOST ? process.env.DB_HOST : 'localhost',
  port: process.env.DB_PORT ? process.env.DB_PORT : 5432,
  username: process.env.DB_USERNAME ? process.env.DB_USERNAME : 'postgres',
  password: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : 'postgres',
  database: process.env.DB_NAME ? process.env.DB_NAME : 'exam',
  entities: [SupermarketEntity, CityEntity],
  synchronize: true,
};
