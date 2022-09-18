import {Test, TestingModule} from '@nestjs/testing';
import {SupermarketCityService} from './supermarket-city.service';
import {typeormTestingConfig} from '../shared/test-utils/typeorm-testing-config';
import {CityService} from '../city/city.service';
import {SupermarketService} from '../supermarket/supermarket.service';
import {Repository} from 'typeorm';
import {CityEntity} from '../city/city.entity';
import {SupermarketEntity} from '../supermarket/supermarket.entity';
import {getRepositoryToken} from '@nestjs/typeorm';
import {CityModule} from '../city/city.module';
import {SupermarketModule} from '../supermarket/supermarket.module';
import {faker} from '@faker-js/faker';
import {plainToInstance} from 'class-transformer';
import {ConflictException, NotFoundException, PreconditionFailedException} from '@nestjs/common';
import exp from 'constants';

describe('SupermarketCityService', () => {
    let mainService: SupermarketCityService;
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
            lat: faker.datatype.number({min: 5000, max: 50000000}),
            lng: faker.datatype.number({min: 5000, max: 50000000}),
            webpage: faker.internet.url(),
            cities: [],
        };
        const obj2 = {
            id: faker.datatype.uuid(),
            name: faker.name.firstName(),
            country: faker.address.country(),
            citizens: faker.datatype.number({min: 5000, max: 50000000}),
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
        cityList = await cityRepository.find({relations: ['supermarkets']});
        superMarketList = await superMarketRepository.find({
            relations: ['cities'],
        });
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [...typeormTestingConfig(), CityModule, SupermarketModule],
            providers: [SupermarketCityService],
        }).compile();

        mainService = module.get<SupermarketCityService>(SupermarketCityService);
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

    it('should obtain all supermarket cities', async () => {
        const referenceSuperMarket: SupermarketEntity = superMarketList[0];
        const cities: CityEntity[] =
            await mainService.getSupermarketCities(referenceSuperMarket.id);
        expect(cities.length).toEqual(3);
    });

    it('should obtain specific supermarket city', async () => {
        const referenceSupermarket: SupermarketEntity = superMarketList[0];
        const referenceCity: CityEntity = cityList[0];
        const storedCity: CityEntity = await mainService.getSupermarketCity(
            referenceSupermarket.id, referenceCity.id
        );
        expect(storedCity).not.toBeNull();
    });

    it('should throw an HTTP exception for not associated city', async () => {
        const referenceSupermarket: SupermarketEntity = superMarketList[0];
        const referenceCity: CityEntity = cityList[4];
        try {
            await mainService.getSupermarketCity(
                referenceSupermarket.id,
                referenceCity.id,
            );
        } catch (error) {
            expect(error instanceof PreconditionFailedException).toBeTruthy();
        }
    });

    it('should add a city to certain supermarket', async () => {
        const referenceSupermarket: SupermarketEntity = superMarketList[0];
        const referenceCity: CityEntity = cityList[4];

        await mainService.addSuperMarketCity(
            referenceSupermarket.id,
            referenceCity.id,
        );
        const storedSuperMarket = await supermarketService.findOne(referenceSupermarket.id);
        expect(storedSuperMarket.cities.length).toEqual(4);
    });

    it('should throw an HTTP exception when adding same supermarket twice to certain city', async () => {
        const referenceSupermarket: SupermarketEntity = superMarketList[0];
        const referenceCity: CityEntity = cityList[4];
        try {
            for (let i = 0; i < 2; i++) {
                await mainService.addSuperMarketCity(
                    referenceSupermarket.id,
                    referenceCity.id,
                );
            }
        } catch (error) {
            expect(error instanceof ConflictException);
        }
    });

    it('should associate new cities to certain supermarket', async () => {
        const referenceSupermarket: SupermarketEntity = superMarketList[0];
        await mainService.associateSuperMarketCities(
            referenceSupermarket.id,
            cityList.slice(2, 4).map((city)=>city.id),
        );
        const storedSuperMarket = await supermarketService.findOne(referenceSupermarket.id);
        expect(storedSuperMarket.cities.length).toEqual(2);
    });

    it('should remove a city from certain supermarket', async () => {
      const referenceSupermarket: SupermarketEntity = superMarketList[0];
      const referenceCity: CityEntity = cityList[0];
        await mainService.removeSuperMarketCity(
            referenceSupermarket.id,
            referenceCity.id
        );
        const storedSuperMarket:SupermarketEntity = await supermarketService.findOne(referenceSupermarket.id);
        expect(storedSuperMarket.cities.length).toEqual(2);
    });

    it('should throw an HTTP exception when removing a city that is not part of the supermarket city list', async () => {
        const referenceSupermarket: SupermarketEntity = superMarketList[0];
        const referenceCity: CityEntity = cityList[4];
        try {
            await mainService.removeSuperMarketCity(
                referenceSupermarket.id,
                referenceCity.id
            );
        } catch (error) {
            expect(error instanceof ConflictException);
        }
    });

    it('should throw an HTTP exception when removing a non-existing city from supermarket', async () => {
        const referenceSupermarket: SupermarketEntity = superMarketList[0];
        const referenceCity: CityEntity = generateEntities()[1];
        try {
            await mainService.removeSuperMarketCity(
                referenceSupermarket.id,
                referenceCity.id
            );
        } catch (error) {
            expect(error instanceof NotFoundException);
        }
    });
});
