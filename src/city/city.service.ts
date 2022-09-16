import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityEntity } from './city.entity';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(CityEntity)
    private cityRepository: Repository<CityEntity>,
  ) {}

  private async searchById(cityId: string): Promise<CityEntity> {
    const searchedCity: CityEntity = await this.cityRepository.findOne({
      where: { id: cityId },
      relations: ['supermarkets'],
    });
    if (!searchedCity) {
      throw new NotFoundException('City with given Id cannot be found');
    }
    return searchedCity;
  }

  async create(city: CityEntity): Promise<CityEntity> {
    return await this.cityRepository.save(city);
  }

  async findAll(): Promise<CityEntity[]> {
    return await this.cityRepository.find();
  }

  async findOne(cityId: string): Promise<CityEntity> {
    return await this.searchById(cityId);
  }

  async updateOne(cityId: string, city: CityEntity) {
    const targetCity = await this.searchById(cityId);
    const { id, ...rest } = city;
    return await this.cityRepository.save({
      ...targetCity,
      ...rest,
    });
  }

  async deleteOne(cityId: string): Promise<string> {
    const targetCity: CityEntity = await this.searchById(cityId);
    await this.cityRepository.remove(targetCity);
    return `City ${targetCity.name} was succesfully removed`;
  }
}
