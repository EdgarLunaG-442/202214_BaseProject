import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupermarketEntity } from './supermarket.entity';

@Injectable()
export class SupermarketService {
  constructor(
    @InjectRepository(SupermarketEntity)
    private supermarketRepository: Repository<SupermarketEntity>,
  ) {}

  private async searchById(superMarketId: string): Promise<SupermarketEntity> {
    const searchedSuperMarket: SupermarketEntity =
      await this.supermarketRepository.findOne({
        where: { id: superMarketId },
        relations: ['cities'],
      });
    if (!searchedSuperMarket) {
      throw new NotFoundException('Supermarket with given Id cannot be found');
    }
    return searchedSuperMarket;
  }

  async create(superMarket: SupermarketEntity): Promise<SupermarketEntity> {
    return await this.supermarketRepository.save(superMarket);
  }

  async findAll(): Promise<SupermarketEntity[]> {
    return await this.supermarketRepository.find({ relations: ['cities'] });
  }

  async findOne(superMarketId: string): Promise<SupermarketEntity> {
    return await this.searchById(superMarketId);
  }

  async updateOne(superMarketId: string, superMarket: SupermarketEntity) {
    const targetSuperMarket = await this.searchById(superMarketId);
    const { id, ...rest } = superMarket;
    return await this.supermarketRepository.save({
      ...targetSuperMarket,
      ...rest,
    });
  }

  async deleteOne(superMarketId: string): Promise<string> {
    const targetSuperMarket: SupermarketEntity = await this.searchById(
      superMarketId,
    );
    await this.supermarketRepository.remove(targetSuperMarket);
    return `SuperMarket ${targetSuperMarket.name} was succesfully removed`;
  }
}
