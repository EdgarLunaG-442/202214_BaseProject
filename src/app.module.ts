import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbCongif } from './shared/config/dbconfig';
import { CityModule } from './city/city.module';
import { SupermarketModule } from './supermarket/supermarket.module';
import { CitySupermarketModule } from './city-supermarket/city-supermarket.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbCongif),
    CityModule,
    SupermarketModule,
    CitySupermarketModule,
  ],
})
export class AppModule {}
