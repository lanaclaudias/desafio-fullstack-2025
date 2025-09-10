import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  IsArray,
  ArrayNotEmpty,
  Matches,
} from 'class-validator';

export class CreateCarDto {
  @IsString()
  @IsNotEmpty({ message: 'Modelo é obrigatório.' })
    model: string;

  @IsOptional()
  @IsString()
    version?: string;

    @IsOptional()
  @IsString()
      description?: string;
  
  @IsString()
  @Matches(/^\d{4}(\/\d{4})?$/, { message: 'Ano inválido. Use 2018 ou 2018/2019' })
    year: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value == null ? undefined : Number(value)))
  @IsNumber({}, { message: 'mileage deve ser um número' })
    mileage?: number;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value == null ? undefined : Number(value)))
  @IsNumber({}, { message: 'price deve ser um número' })
    price?: number;

  @Transform(({ value }) => Number(value))
  @IsInt({ message: 'brandId inválido' })
  @Min(1, { message: 'brandId inválido' })
    brandId: number;

  @Transform(({ value }) => Number(value))
  @IsInt({ message: 'storeId inválido' })
  @Min(1, { message: 'storeId inválido' })
    storeId: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
    images?: string[];
}