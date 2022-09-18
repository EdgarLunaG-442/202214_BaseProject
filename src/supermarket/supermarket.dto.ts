import { IsString, IsNumber } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
import {faker} from "@faker-js/faker";

faker.seed(123)

export class SupermarketDto {
  @IsString()
  name: string;

  @IsNumber()
  lng: number;

  @IsNumber()
  lat: number;

  @IsString()
  webpage: string;
}
