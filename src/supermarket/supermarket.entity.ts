import { Column, PrimaryGeneratedColumn, Entity, ManyToMany } from 'typeorm';
import { CityEntity } from '../city/city.entity';
@Entity()
export class SupermarketEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  lng: number;

  @Column()
  lat: number;

  @Column()
  webpage: string;

  @ManyToMany(() => CityEntity, (city) => city.supermarkets)
  cities: CityEntity[];
}
