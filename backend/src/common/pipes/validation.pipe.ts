import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
  if (!metadata || !metadata.metatype) return value;
  const metatype = metadata.metatype as any;

  const primitiveTypes = [String, Boolean, Number, Array, Object];
  if (primitiveTypes.includes(metatype)) return value;

  const object = plainToInstance(metatype, value);
  const errors = await validate(object);

    if (errors.length > 0) {
      throw new BadRequestException('Validation failed: ' + this.formatErrors(errors));
    }
    return value;
  }

  private formatErrors(errors: any[]): string {
    return errors.map(err => {
      return `${err.property} has wrong value ${err.value}, expected ${Object.values(err.constraints).join(', ')}`;
    }).join(', ');
  }
}