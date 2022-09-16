import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbCongif } from './shared/config/dbconfig';
import { CityModule } from './city/city.module';
import { SupermarketModule } from './supermarket/supermarket.module';

@Module({
  imports: [TypeOrmModule.forRoot(dbCongif), CityModule, SupermarketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
