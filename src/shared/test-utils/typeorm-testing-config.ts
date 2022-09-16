import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from '../../city/city.entity';
import { SupermarketEntity } from '../../supermarket/supermarket.entity';

export const typeormTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [CityEntity, SupermarketEntity],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([CityEntity, SupermarketEntity]),
];
