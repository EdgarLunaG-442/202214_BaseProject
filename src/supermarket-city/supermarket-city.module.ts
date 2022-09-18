import { Module } from '@nestjs/common';
import { SupermarketCityService } from './supermarket-city.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from '../city/city.entity';
import { SupermarketEntity } from '../supermarket/supermarket.entity';
import { CityModule } from '../city/city.module';
import { SupermarketModule } from '../supermarket/supermarket.module';
import { SupermarketCityController } from './supermarket-city.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CityEntity, SupermarketEntity]),
    CityModule,
    SupermarketModule,
  ],
  providers: [SupermarketCityService],
  controllers: [SupermarketCityController],
})
export class SupermarketCityModule {}
