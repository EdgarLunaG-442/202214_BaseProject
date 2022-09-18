import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {SupermarketCityService} from "./supermarket-city.service";


@Controller('supermarkets')
@ApiTags('Relationship Supermarket-City')
export class SupermarketCityController {
    constructor(private supermarketCityService: SupermarketCityService) {
    }

    @HttpCode(200)
    @Post(':superMarketId/cities/:cityId')
    async addSupermarketCity(@Param('cityId') cityId: string, @Param('superMarketId') superMarketId: string) {
        return await this.supermarketCityService.addSuperMarketCity(superMarketId, cityId)
    }

    @Get(':superMarketId/cities/:cityId')
    async getSupermarketCity(@Param('cityId') cityId: string, @Param('superMarketId') superMarketId: string) {
        return await this.supermarketCityService.getSupermarketCity(superMarketId, cityId)
    }

    @Get(':superMarketId/cities')
    async getSupermarketCities(@Param('superMarketId') superMarketId: string) {
        return await this.supermarketCityService.getSupermarketCities(superMarketId)
    }

    @Put(':superMarketId/cities')
    async associateSupermarketCities(@Param('superMarketId') superMarketId: string, @Body() citiesIds: string[]){
        return await this.supermarketCityService.associateSuperMarketCities(superMarketId,citiesIds);
    }

    @HttpCode(200)
    @Delete(':superMarketId/cities/:cityId')
    async removeSupermarketCity(@Param('cityId') cityId: string, @Param('superMarketId') superMarketId: string) {
        return await this.supermarketCityService.removeSuperMarketCity(superMarketId, cityId)
    }
}
