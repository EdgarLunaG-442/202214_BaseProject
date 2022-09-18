import { Test, TestingModule } from '@nestjs/testing';
import { CityService } from './city.service';
import { typeormTestingConfig } from '../shared/test-utils/typeorm-testing-config';
import { CityEntity } from './city.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { plainToInstance } from 'class-transformer';
import { NotFoundException } from '@nestjs/common';

describe('CityService', () => {
  let service: CityService;
  let repository: Repository<CityEntity>;
  let cityList: CityEntity[];

  const generateEntity = () => {
    const obj = {
      id: faker.datatype.uuid(),
      name: faker.name.firstName(),
      country: faker.address.country(),
      citizens: faker.datatype.number({ min: 5000, max: 50000000 }),
      supermarkets: [],
    };
    return plainToInstance(CityEntity, obj);
  };

  const entitySeed = async () => {
    for (let i = 0; i < 5; i++) {
      const savedEntity: CityEntity = await repository.save(generateEntity());
      cityList.push(savedEntity);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...typeormTestingConfig()],
      providers: [CityService],
    }).compile();

    service = module.get<CityService>(CityService);
    repository = module.get<Repository<CityEntity>>(
      getRepositoryToken(CityEntity),
    );
    cityList = [];
    await entitySeed();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return stored entities', async () => {
    const cities = await service.findAll();
    expect(cities.length).toEqual(5);
  });

  it('should return one entity with specific Id', async () => {
    const referenceCity = cityList[0];
    const city = await service.findOne(referenceCity.id);
    expect(city).toBeDefined();
    expect(city).not.toBeNull();
    expect(city.id).toEqual(referenceCity.id);
  });

  it('should raise an HTTP exception when ID not found', async () => {
    try {
      const city = await service.findOne(faker.datatype.uuid());
    } catch (error) {
      expect(error instanceof NotFoundException).toBeTruthy();
    }
  });

  it('should create a city', async () => {
    await service.create(generateEntity());
    const cities: CityEntity[] = await service.findAll();
    expect(cities.length).toEqual(6);
  });

  it('should update a city', async () => {
    const { id: unusedId, ...rest } = generateEntity();
    const referenceCity = { ...cityList[0], ...rest };
    await service.updateOne(cityList[0].id, referenceCity);
    const city: CityEntity = await service.findOne(cityList[0].id);
    const { id: cityId, ...rest2 } = city;
    expect(rest).toEqual(rest2);
  });

  it('should delete a city', async () => {
    const referenceCity: CityEntity = cityList[cityList.length - 1];
    await service.deleteOne(referenceCity.id);
    const remainingCities = await service.findAll();
    expect(remainingCities.length).toEqual(4);
  });
});
