import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { SupermarketEntity } from '../supermarket/supermarket.entity';
@Entity()
export class CityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  country: string;

  @Column()
  citizens: number;

  @ManyToMany(() => SupermarketEntity, (supermarket) => supermarket.cities)
  @JoinTable()
  supermarkets: SupermarketEntity[];
}
