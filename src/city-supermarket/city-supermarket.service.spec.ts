import { Test, TestingModule } from '@nestjs/testing';
import { CitySupermarketService } from './city-supermarket.service';
import { typeormTestingConfig } from '../shared/test-utils/typeorm-testing-config';
import { CityService } from '../city/city.service';
import { SupermarketService } from '../supermarket/supermarket.service';
import { Repository } from 'typeorm';
import { CityEntity } from '../city/city.entity';
import { SupermarketEntity } from '../supermarket/supermarket.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CityModule } from '../city/city.module';
import { SupermarketModule } from '../supermarket/supermarket.module';
import { faker } from '@faker-js/faker';
import { plainToInstance } from 'class-transformer';
import {ConflictException, NotFoundException, PreconditionFailedException} from '@nestjs/common';
import exp from 'constants';

describe('CitySupermarketService', () => {
  let mainService: CitySupermarketService;
  let cityService: CityService;
  let supermarketService: SupermarketService;
  let cityRepository: Repository<CityEntity>;
  let superMarketRepository: Repository<SupermarketEntity>;
  let cityList: CityEntity[];
  let superMarketList: SupermarketEntity[];

  const generateEntities = (): [SupermarketEntity, CityEntity] => {
    const obj1 = {
      id: faker.datatype.uuid(),
      name: faker.name.firstName(),
      lat: faker.datatype.number({ min: 5000, max: 50000000 }),
      lng: faker.datatype.number({ min: 5000, max: 50000000 }),
      webpage: faker.internet.url(),
      cities: [],
    };
    const obj2 = {
      id: faker.datatype.uuid(),
      name: faker.name.firstName(),
      country: faker.address.country(),
      citizens: faker.datatype.number({ min: 5000, max: 50000000 }),
      supermarkets: [],
    };
    return [
      plainToInstance(SupermarketEntity, obj1),
      plainToInstance(CityEntity, obj2),
    ];
  };

  const entitiesSeed = async () => {
    for (let i = 0; i < 5; i++) {
      const [superMarket, city] = generateEntities();
      superMarketList.push(await superMarketRepository.save(superMarket));
      cityList.push(await cityRepository.save(city));
    }
    cityList[0].supermarkets = [
      superMarketList[0],
      superMarketList[1],
      superMarketList[2],
    ];
    cityList[1].supermarkets = [
      superMarketList[0],
      superMarketList[1],
      superMarketList[2],
    ];
    cityList[2].supermarkets = [
      superMarketList[0],
      superMarketList[1],
      superMarketList[2],
    ];
    for (let i = 0; i < 5; i++) {
      await cityRepository.save(cityList[i]);
    }
    cityList = await cityRepository.find({ relations: ['supermarkets'] });
    superMarketList = await superMarketRepository.find({
      relations: ['cities'],
    });
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...typeormTestingConfig(), CityModule, SupermarketModule],
      providers: [CitySupermarketService],
    }).compile();

    mainService = module.get<CitySupermarketService>(CitySupermarketService);
    cityService = module.get<CityService>(CityService);
    supermarketService = module.get<SupermarketService>(SupermarketService);
    cityRepository = module.get<Repository<CityEntity>>(
      getRepositoryToken(CityEntity),
    );
    superMarketRepository = module.get<Repository<SupermarketEntity>>(
      getRepositoryToken(SupermarketEntity),
    );
    superMarketList = [];
    cityList = [];
    await entitiesSeed();
  });

  it('should be defined', () => {
    expect(mainService).toBeDefined();
    expect(cityService).toBeDefined();
    expect(supermarketService).toBeDefined();
  });

  it('should obtain all city supermarkets', async () => {
    const referenceCity: CityEntity = cityList[0];
    const supermarkets: SupermarketEntity[] =
      await mainService.getCitySupermarkets(referenceCity.id);
    expect(supermarkets.length).toEqual(3);
  });

  it('should obtain specific city supermarket', async () => {
    const referenceCity: CityEntity = cityList[0];
    const referenceSupermarket: SupermarketEntity = superMarketList[0];
    const storedSuperMarket = await mainService.getCitySupermarket(
      referenceCity.id,
      referenceSupermarket.id,
    );
    expect(storedSuperMarket).not.toBeNull();
  });

  it('should throw an HTTP exception for not associated supermarket', async () => {
    const referenceCity: CityEntity = cityList[0];
    const referenceSupermarket: SupermarketEntity = generateEntities()[0];
    try {
      await mainService.getCitySupermarket(
        referenceCity.id,
        referenceSupermarket.id,
      );
    } catch (error) {
      expect(error instanceof PreconditionFailedException).toBeTruthy();
    }
  });

  it('should add a supermarket to certain city', async () => {
    const referenceCity: CityEntity = cityList[0];
    const referenceSupermarket: SupermarketEntity = superMarketList[3];
    await mainService.addCitySuperMarket(
      referenceCity.id,
      referenceSupermarket.id,
    );
    const storedCity = await cityService.findOne(referenceCity.id);
    expect(storedCity.supermarkets.length).toEqual(4);
  });

  it('should throw an HTTP exception when adding same supermarket twice to certain city', async () => {
    const referenceCity: CityEntity = cityList[0];
    const referenceSupermarket: SupermarketEntity = superMarketList[3];
    try {
      for (let i = 0; i < 2; i++) {
        await mainService.addCitySuperMarket(
          referenceCity.id,
          referenceSupermarket.id,
        );
      }
    } catch (error) {
      expect(error instanceof ConflictException);
    }
  });

  it('should associate new supermarkets to certain city', async () => {
    const referenceCity: CityEntity = cityList[0];
    await mainService.associateCitySuperMarkets(
      referenceCity.id,
      superMarketList.slice(2, 4),
    );
    const storedCity = await cityService.findOne(referenceCity.id);
    expect(storedCity.supermarkets.length).toEqual(2);
  });

  it('should remove a supermarket from certain city', async () => {
    const referenceCity: CityEntity = cityList[0];
    const referenceSupermarket: SupermarketEntity = superMarketList[0];
    await mainService.removeCitySuperMarket(
      referenceCity.id,
      referenceSupermarket.id,
    );
    const storedCity = await cityService.findOne(referenceCity.id);
    expect(storedCity.supermarkets.length).toEqual(2);
  });

  it('should throw an HTTP exception when removing a supermarket that is not part of the city supermarket list', async () => {
    const referenceCity: CityEntity = cityList[0];
    const referenceSupermarket: SupermarketEntity = superMarketList[4];
    try {
      await mainService.removeCitySuperMarket(
        referenceCity.id,
        referenceSupermarket.id,
      );
    } catch (error) {
      expect(error instanceof ConflictException);
    }
  });

  it('should throw an HTTP exception when removing a non-existing supermarket from city', async () => {
    const referenceCity: CityEntity = cityList[0];
    const referenceSupermarket: SupermarketEntity = generateEntities()[0];
    try {
      await mainService.removeCitySuperMarket(
        referenceCity.id,
        referenceSupermarket.id,
      );
    } catch (error) {
      expect(error instanceof NotFoundException);
    }
  });
});
