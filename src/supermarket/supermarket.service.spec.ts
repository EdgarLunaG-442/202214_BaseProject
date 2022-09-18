import { Test, TestingModule } from '@nestjs/testing';
import { SupermarketService } from './supermarket.service';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { plainToInstance } from 'class-transformer';
import { SupermarketEntity } from './supermarket.entity';
import { typeormTestingConfig } from '../shared/test-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('SupermarketService', () => {
  let service: SupermarketService;
  let repository: Repository<SupermarketEntity>;
  let superMarketList: SupermarketEntity[];

  const generateEntity = () => {
    const obj = {
      id: faker.datatype.uuid(),
      name: faker.name.firstName(),
      lat: faker.datatype.number({ min: 5000, max: 50000000 }),
      lng: faker.datatype.number({ min: 5000, max: 50000000 }),
      webpage: faker.internet.url(),
      cities: [],
    };
    return plainToInstance(SupermarketEntity, obj);
  };

  const entitySeed = async () => {
    for (let i = 0; i < 5; i++) {
      const savedEntity: SupermarketEntity = await repository.save(
        generateEntity(),
      );
      superMarketList.push(savedEntity);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...typeormTestingConfig()],
      providers: [SupermarketService],
    }).compile();
    service = module.get<SupermarketService>(SupermarketService);
    repository = module.get<Repository<SupermarketEntity>>(
      getRepositoryToken(SupermarketEntity),
    );
    superMarketList = [];
    await entitySeed();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return stored entities', async () => {
    const superMarkets = await service.findAll();
    expect(superMarkets.length).toEqual(5);
  });

  it('should return one entity with specific Id', async () => {
    const referenceSuperMarket = superMarketList[0];
    const superMarket = await service.findOne(referenceSuperMarket.id);
    expect(superMarket).toBeDefined();
    expect(superMarket).not.toBeNull();
    expect(superMarket.id).toEqual(referenceSuperMarket.id);
  });

  it('should raise an HTTP exception when ID not found', async () => {
    try {
      const superMarket = await service.findOne(faker.datatype.uuid());
    } catch (error) {
      expect(error instanceof NotFoundException).toBeTruthy();
    }
  });

  it('should create a superMarket', async () => {
    await service.create(generateEntity());
    const superMarkets: SupermarketEntity[] = await service.findAll();
    expect(superMarkets.length).toEqual(6);
  });

  it('should update a superMarket', async () => {
    const { id: unusedId, ...rest } = generateEntity();
    const referenceSuperMarket = { ...superMarketList[0], ...rest };
    await service.updateOne(superMarketList[0].id, referenceSuperMarket);
    const superMarket: SupermarketEntity = await service.findOne(
      superMarketList[0].id,
    );
    const { id: superMarketId, ...rest2 } = superMarket;
    expect(rest).toEqual(rest2);
  });

  it('should delete a superMarket', async () => {
    const referenceSuperMarket: SupermarketEntity =
      superMarketList[superMarketList.length - 1];
    await service.deleteOne(referenceSuperMarket.id);
    const remainingCities = await service.findAll();
    expect(remainingCities.length).toEqual(4);
  });
});
