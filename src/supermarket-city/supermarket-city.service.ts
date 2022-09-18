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
export class SupermarketCityService {
  constructor(
    private cityService: CityService,
    private supermarketService: SupermarketService,
  ) {}

  private searchCity(
    cityId: string,
    cities: CityEntity[],
    isAdding = false,
  ) {
    const searchedCity = cities.find(
      (sm) => sm.id === cityId,
    );
    if (!searchedCity && !isAdding) {
      throw new PreconditionFailedException(
        'City with the given id is not associated to that supermarket',
      );
    } else if (searchedCity && isAdding) {
      throw new ConflictException('Supermarket already has this city');
    }
    return searchedCity;
  }

  async getSupermarketCities(superMarketId: string) {
    const superMarket = await this.supermarketService.findOne(superMarketId);
    return superMarket.cities;
  }

  async getSupermarketCity(superMarketId: string, cityId: string) {
    const superMarket = await this.supermarketService.findOne(superMarketId);
    return this.searchCity(cityId, superMarket.cities);
  }

  async addSuperMarketCity(superMarketId: string, cityId: string) {
    const superMarket = await this.supermarketService.findOne(superMarketId);
    const city = await this.cityService.findOne(cityId);
    await this.searchCity(cityId, superMarket.cities, true);
    superMarket.cities.push(city);
    return await this.supermarketService.updateOne(superMarketId, superMarket);
  }

  async associateSuperMarketCities(
      superMarketId: string,
      citiesIds: string[],
  ): Promise<SupermarketEntity> {
    const superMarket = await this.supermarketService.findOne(superMarketId);
    const cities: CityEntity[] = []
    for(let i in citiesIds){
      cities.push(await this.cityService.findOne(citiesIds[i]))
    }
    superMarket.cities = cities;
    await this.supermarketService.updateOne(superMarketId,superMarket)
    return await this.supermarketService.findOne(superMarketId);
  }

  async removeSuperMarketCity(
      superMarketId: string,
      cityId: string,

  ): Promise<SupermarketEntity> {
    const superMarket = await this.supermarketService.findOne(superMarketId);
    const undesiredCity = this.searchCity(cityId,superMarket.cities)
    superMarket.cities = superMarket.cities.filter((city) => city.id !== undesiredCity.id);
    await this.supermarketService.updateOne(superMarketId, superMarket);
    return await this.supermarketService.findOne(superMarketId);
  }
}
