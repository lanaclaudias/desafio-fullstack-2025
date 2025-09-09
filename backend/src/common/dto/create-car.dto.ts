import { IsNotEmpty, IsOptional, Matches, IsNumberString, IsArray, IsString } from 'class-validator';

export class CreateCarDto {
  @IsNotEmpty()
  model: string;

  @IsNotEmpty()
  version: string;

  @IsNotEmpty()
  @Matches(/^\d{4}(\/\d{4})?$/, { message: 'Ano inválido. Use 2018 ou 2018/2019' })
  year: string;

  @IsNotEmpty()
  @IsNumberString()
  mileage: string;

  @IsNotEmpty()
  @IsNumberString()
  price: string;

  @IsOptional()
  description?: string;

  @IsNotEmpty()
  brandId: number;

  @IsNotEmpty()
  storeId: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}