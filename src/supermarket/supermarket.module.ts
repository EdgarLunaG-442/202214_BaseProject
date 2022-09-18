import { Module } from '@nestjs/common';
import { SupermarketController } from './supermarket.controller';
import { SupermarketService } from './supermarket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupermarketEntity } from './supermarket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SupermarketEntity])],
  controllers: [SupermarketController],
  providers: [SupermarketService],
  exports: [SupermarketService],
})
export class SupermarketModule {}
