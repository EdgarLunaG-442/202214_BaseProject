import {SupermarketEntity} from "../supermarket/supermarket.entity";
import {IsNumber, IsString} from "class-validator";

export class CityDto{
  @IsString()
  name: string;

  @IsString()
  country: string;

  @IsNumber()
  citizens: number;

}