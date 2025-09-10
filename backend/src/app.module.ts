import { Module, OnModuleInit } from '@nestjs/common';

import { CommonModule } from './common/common.module';
import { BrandsModule } from './modules/brands/brands.module';
import { StoresModule } from './modules/stores/stores.module';
import { CarsModule } from './modules/cars/cars.module';
import { AppDataSource } from './data-source';
import { UploadsModule } from './modules/uploads/uploads.module';

@Module({
  imports: [ CommonModule, BrandsModule, StoresModule,CarsModule,  UploadsModule,],
   
})
export class AppModule implements OnModuleInit {
  async onModuleInit() {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  }
}