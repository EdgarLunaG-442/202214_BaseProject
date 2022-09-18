import {
  ConflictException,
  Injectable,
  PreconditionFailedException,
} from '@nestjs/common';
import { CityService } from '../city/city.service';
import { SupermarketService } from '../supermarket/supermarket.service';
import { SupermarketEntity } from '../supermarket/supermarket.entity';
import { CityEntity } from '../city/city.entity';

@Injectable()
export class CitySupermarketService {
  constructor(
    private cityService: CityService,
    private supermarketService: SupermarketService,
  ) {}

  private searchSuperMarket(
    superMarketId: string,
    superMarkets: SupermarketEntity[],
    isAdding = false,
  ) {
    const searchedSuperMarket = superMarkets.find(
      (sm) => sm.id === superMarketId,
    );
    if (!searchedSuperMarket && !isAdding) {
      throw new PreconditionFailedException(
        'SuperMarket with the given id is not associated to that city',
      );
    } else if (searchedSuperMarket && isAdding) {
      throw new ConflictException('City already has this supermarket');
    }
    return searchedSuperMarket;
  }

  async getCitySupermarkets(cityId: string) {
    const city = await this.cityService.findOne(cityId);
    return city.supermarkets;
  }

  async getCitySupermarket(cityId: string, superMarketId: string) {
    const city = await this.cityService.findOne(cityId);
    return this.searchSuperMarket(superMarketId, city.supermarkets);
  }

  async addCitySuperMarket(cityId: string, superMarketId: string) {
    const city = await this.cityService.findOne(cityId);
    const superMarket = await this.supermarketService.findOne(superMarketId);
    await this.searchSuperMarket(cityId, city.supermarkets, true);
    city.supermarkets.push(superMarket);
    return await this.cityService.updateOne(cityId, city);
  }

  async associateCitySuperMarkets(
    cityId: string,
    superMarketsIds: string[],
  ): Promise<CityEntity> {
    const city = await this.cityService.findOne(cityId);
    const superMarkets = []
    for(let i in superMarketsIds){
      superMarkets.push(await this.supermarketService.findOne(superMarketsIds[i]));
    }
    city.supermarkets = superMarkets;
    await this.cityService.updateOne(cityId, city);
    return await this.cityService.findOne(cityId);
  }

  async removeCitySuperMarket(
    cityId: string,
    superMarketId: string,
  ): Promise<CityEntity> {
    const city = await this.cityService.findOne(cityId);
    const undesiredSuper = this.searchSuperMarket(
      superMarketId,
      city.supermarkets,
    );
    city.supermarkets = city.supermarkets.filter((sm) => sm !== undesiredSuper);
    await this.cityService.updateOne(cityId, city);
    return await this.cityService.findOne(cityId);
  }
}
