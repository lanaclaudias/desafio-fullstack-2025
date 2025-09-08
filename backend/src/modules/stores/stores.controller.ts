import { Controller, Get, Param } from '@nestjs/common';
import { StoresService } from './stores.service';

@Controller('api/stores')
export class StoresController {
  constructor(private readonly service: StoresService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('by-brand/:name')
  findByBrand(@Param('name') name: string) {
    return this.service.findByBrandName(name);
  }
}
