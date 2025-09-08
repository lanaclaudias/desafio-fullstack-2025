import { Module, OnModuleInit } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { CommonModule } from './common/common.module';
import { BrandsModule } from './modules/brands/brands.module';
import { StoresModule } from './modules/stores/stores.module';
import { CarsModule } from './modules/cars/cars.module';
import { AppDataSource } from './data-source';

@Module({
  imports: [UsersModule, CommonModule, BrandsModule, StoresModule, CarsModule],
})
export class AppModule implements OnModuleInit {
  async onModuleInit() {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  }
}