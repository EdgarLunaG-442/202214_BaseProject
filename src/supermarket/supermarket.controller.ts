import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SupermarketService } from './supermarket.service';
import { SupermarketDto } from './supermarket.dto';
import { plainToInstance } from 'class-transformer';
import { SupermarketEntity } from './supermarket.entity';
import {ApiTags} from "@nestjs/swagger";

@ApiTags('SuperMarket')
@Controller('supermarkets')
export class SupermarketController {
  constructor(private supermarketService: SupermarketService) {}

  @Post()
  async create(@Body() supermarketDto: SupermarketDto) {
    const newSupermarket: SupermarketEntity = plainToInstance(
      SupermarketEntity,
      supermarketDto,
    );
    return await this.supermarketService.create(newSupermarket);
  }

  @Get()
  async findAll() {
    return await this.supermarketService.findAll();
  }

  @Get(':superMarketId')
  async findOne(@Param('superMarketId') superMarketId: string) {
    return await this.supermarketService.findOne(superMarketId);
  }

  @Put(':superMarketId')
  async updateOne(
    @Param('superMarketId') superMarketId: string,
    @Body() supermarketDto: SupermarketDto,
  ) {
    const supermarket: SupermarketEntity = plainToInstance(
      SupermarketEntity,
      supermarketDto,
    );
    return await this.supermarketService.updateOne(superMarketId, supermarket);
  }

  @HttpCode(204)
  @Delete(':superMarketId')
  async deleteOne(@Param('superMarketId') superMarketId: string) {
    await this.supermarketService.deleteOne(superMarketId);
  }
}
