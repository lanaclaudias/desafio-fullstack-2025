// filepath: c:\Users\lanas\desafio-fullstack-2025\backend\src\modules\cars\cars.module.ts
import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CarsController],
  providers: [CarsService],
})
export class CarsModule {}