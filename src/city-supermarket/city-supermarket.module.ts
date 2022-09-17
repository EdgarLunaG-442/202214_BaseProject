import { Module } from '@nestjs/common';
import { CitySupermarketService } from './city-supermarket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from '../city/city.entity';
import { SupermarketEntity } from '../supermarket/supermarket.entity';
import { CityModule } from '../city/city.module';
import { SupermarketModule } from '../supermarket/supermarket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CityEntity, SupermarketEntity]),
    CityModule,
    SupermarketModule,
  ],
  providers: [CitySupermarketService],
})
export class CitySupermarketModule {}
