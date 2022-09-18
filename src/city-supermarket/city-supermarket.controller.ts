import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {CitySupermarketService} from "./city-supermarket.service";
import {IsString, IsUUID} from "class-validator";


@Controller('cities')
@ApiTags('Relationship City-Supermarket')
export class CitySupermarketController {
    constructor(private citySupermarketService: CitySupermarketService) {
    }

    @HttpCode(200)
    @Post(':cityId/supermarkets/:superMarketId')
    async addCitySupermarket(@Param('cityId') cityId: string, @Param('superMarketId') superMarketId: string) {
        return await this.citySupermarketService.addCitySuperMarket(cityId, superMarketId)
    }

    @Get(':cityId/supermarkets/:superMarketId')
    async getCitySupermarket(@Param('cityId') cityId: string, @Param('superMarketId') superMarketId: string) {
        return await this.citySupermarketService.getCitySupermarket(cityId, superMarketId)
    }

    @Get(':cityId/supermarkets')
    async getCitySupermarkets(@Param('cityId') cityId: string) {
        return await this.citySupermarketService.getCitySupermarkets(cityId)
    }

    @Put(':cityId/supermarkets')
    async associateCitySupermarkets(@Param('cityId') cityId: string, @Body() superMarkets: string[]) {
        return await this.citySupermarketService.associateCitySuperMarkets(cityId, superMarkets)
    }

    @HttpCode(200)
    @Delete(':cityId/supermarkets/:superMarketId')
    async removeCitySupermarket(@Param('cityId') cityId: string, @Param('superMarketId') superMarketId: string) {
        return await this.citySupermarketService.removeCitySuperMarket(cityId, superMarketId)
    }
}
