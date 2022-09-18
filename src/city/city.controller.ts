import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {CityService} from "./city.service";
import {plainToInstance} from "class-transformer";
import {CityEntity} from "./city.entity";
import {CityDto} from "./city.dto";

@Controller('cities')
@ApiTags('Cities')
export class CityController {
    constructor(private cityService: CityService) {
    }

    @Post()
  async create(@Body() cityDto: CityDto) {
    const newCity: CityEntity = plainToInstance(
      CityEntity,
      cityDto,
    );
    return await this.cityService.create(newCity);
  }

  @Get()
  async findAll() {
    return await this.cityService.findAll();
  }

  @Get(':cityId')
  async findOne(@Param('cityId') cityId: string) {
    return await this.cityService.findOne(cityId);
  }

  @Put(':cityId')
  async updateOne(
    @Param('cityId') cityId: string,
    @Body() cityDto: CityDto,
  ) {
    const city: CityEntity = plainToInstance(
      CityEntity,
      cityDto,
    );
    return await this.cityService.updateOne(cityId, city);
  }

  @HttpCode(204)
  @Delete(':cityId')
  async deleteOne(@Param('cityId') cityId: string) {
    await this.cityService.deleteOne(cityId);
  }
}
