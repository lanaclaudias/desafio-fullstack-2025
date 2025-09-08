import { Controller, Get } from '@nestjs/common';
import { BrandsService } from './brands.service';

@Controller('api/brands')
export class BrandsController {
  constructor(private readonly service: BrandsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
