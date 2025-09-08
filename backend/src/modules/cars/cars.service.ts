import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { AppDataSource } from '../../data-source';
import { Car } from './car.entity';
import { Store } from '../stores/store.entity';

@Injectable()
export class CarsService {
  private repo = AppDataSource.getRepository(Car);
  private storeRepo = AppDataSource.getRepository(Store);

  findAll() {
    return this.repo.find({ relations: ['store', 'store.brand'] } as any);
  }

  findOne(id: number) {
  return this.repo.findOne({ where: { id }, relations: ['store', 'store.brand'] } as any);
  }

  async create(payload: any) {
    const store = await this.storeRepo.findOne({ where: { id: payload.storeId }, relations: ['brand'] } as any);
    if (!store) throw new NotFoundException('Store not found');
    // if brandId provided, ensure the store belongs to that brand
    if (payload.brandId && store.brand && store.brand.id != payload.brandId) {
      throw new BadRequestException('A loja selecionada não pertence à marca informada');
    }

    const createObj: any = {
      model: payload.model,
      version: payload.version ?? null,
      year: payload.year,
      mileage: payload.mileage ?? null,
      price: payload.price ?? null,
      description: payload.description ?? null,
      color: payload.color,
      images: payload.images ? JSON.stringify(payload.images) : null,
      store,
    };

    const car = this.repo.create(createObj as any);
    return this.repo.save(car);
  }

  async update(id: number, payload: any) {
    const car = await this.repo.findOne({ where: { id } } as any);
    if (!car) throw new NotFoundException('Car not found');
    if (payload.storeId) {
      const store = await this.storeRepo.findOne({ where: { id: payload.storeId }, relations: ['brand'] } as any);
      if (!store) throw new NotFoundException('Store not found');
      if (payload.brandId && store.brand && store.brand.id != payload.brandId) {
        throw new BadRequestException('A loja selecionada não pertence à marca informada');
      }
      car.store = store;
    }
  // assign only allowed fields
  car.model = payload.model ?? car.model;
  car.version = payload.version ?? car.version;
  car.year = payload.year ?? car.year;
  car.mileage = payload.mileage ?? car.mileage;
  car.price = payload.price ?? car.price;
  car.description = payload.description ?? car.description;
  if (payload.images !== undefined) car.images = payload.images ? JSON.stringify(payload.images) : null;
  car.color = payload.color ?? car.color;
    return this.repo.save(car);
  }

  async remove(id: number) {
    const car = await this.repo.findOne({ where: { id } } as any);
    if (!car) throw new NotFoundException('Car not found');
    return this.repo.remove(car);
  }
}
