import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CarsService } from './cars.service';

@Controller('api/cars')
export class CarsController {
  constructor(private readonly service: CarsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Post()
  create(@Body() payload: any) {
    return this.service.create(payload);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() payload: any) {
    return this.service.update(Number(id), payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
