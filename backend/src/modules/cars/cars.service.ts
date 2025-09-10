import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AppDataSource } from '../../data-source';
import { Repository } from 'typeorm';
import { Car } from './car.entity';
import { Store } from '../stores/store.entity';
import { Brand } from '../brands/brand.entity';
import { CreateCarDto } from '../../common/dto/create-car.dto';
import { UpdateCarDto } from '../../common/dto/update-car.dto';
@Injectable()
export class CarsService {
  private carRepo: Repository<Car> = AppDataSource.getRepository(Car);
  private storeRepo: Repository<Store> = AppDataSource.getRepository(Store);
  private brandRepo: Repository<Brand> = AppDataSource.getRepository(Brand);

  async findAll(): Promise<Car[]> {
    return this.carRepo.find({
      relations: ['store', 'store.brand'],
      order: { id: 'DESC' as any },
    });
  }

  async findOne(id: number): Promise<Car> {
    const car = await this.carRepo.findOne({
      where: { id: Number(id) as any },
      relations: ['store', 'store.brand'],
    });
    if (!car) throw new NotFoundException('Carro não encontrado');
    return car;
  }

  async create(data: any): Promise<Car> {
    const storeIdNum = data?.storeId != null && data?.storeId !== '' ? Number(data.storeId) : NaN;
    if (Number.isNaN(storeIdNum)) throw new BadRequestException('storeId inválido');

    const brandIdNum = data?.brandId != null && data?.brandId !== '' ? Number(data.brandId) : undefined;

    const store = await this.storeRepo.findOne({
      where: { id: storeIdNum as any },
      relations: ['brand'],
    });
    if (!store) throw new BadRequestException('Loja inexistente');

    if (brandIdNum !== undefined && Number(store.brand?.id) !== Number(brandIdNum)) {
      const brands = await this.brandRepo.find({ order: { id: 'ASC' as any } });
      const list = brands.map((b) => `${b.id}:${b.name}`).join(' | ');
      throw new BadRequestException(`Marca inválida (recebido="${brandIdNum}"). Marcas existentes: ${list}`);
    }

    const mileageNum =
      data?.mileage != null && data?.mileage !== '' && !Number.isNaN(Number(data.mileage))
        ? Number(data.mileage)
        : undefined;
    const priceNum =
      data?.price != null && data?.price !== '' && !Number.isNaN(Number(data.price))
        ? Number(data.price)
        : undefined;

    const imagesStr =
      Array.isArray(data?.images)
        ? JSON.stringify(data.images)
        : typeof data?.images === 'string' && data.images.trim() !== ''
          ? data.images
          : undefined;

    const car = this.carRepo.create({
      model: String(data.model ?? ''),
      version: String(data.version ?? ''),
      year: String(data.year ?? ''),
      description: data?.description ?? null,
      ...(mileageNum !== undefined ? { mileage: mileageNum } : {}),
      ...(priceNum !== undefined ? { price: priceNum } : {}),
      ...(imagesStr !== undefined ? { images: imagesStr } : {}),
      storeId: store.id,
    });

    return this.carRepo.save(car);
  }

  async update(id: number, data: any): Promise<Car> {
    const car = await this.carRepo.findOne({
      where: { id: Number(id) as any },
      relations: ['store', 'store.brand'],
    });
    if (!car) throw new NotFoundException('Carro não encontrado');

    let targetStore = car.store;
    if (data?.storeId != null && data?.storeId !== '') {
      const storeIdNum = Number(data.storeId);
      if (Number.isNaN(storeIdNum)) throw new BadRequestException('storeId inválido');
      const found = await this.storeRepo.findOne({ where: { id: storeIdNum as any }, relations: ['brand'] });
      if (!found) throw new BadRequestException('Loja inexistente');
      targetStore = found;
    }

    const brandIdNum = data?.brandId != null && data?.brandId !== '' ? Number(data.brandId) : undefined;
    if (brandIdNum !== undefined && Number(targetStore.brand?.id) !== Number(brandIdNum)) {
      const brands = await this.brandRepo.find({ order: { id: 'ASC' as any } });
      const list = brands.map((b) => `${b.id}:${b.name}`).join(' | ');
      throw new BadRequestException(`Marca inválida (recebido="${brandIdNum}"). Marcas existentes: ${list}`);
    }

    if (data?.model !== undefined) car.model = String(data.model);
    if (data?.version !== undefined) car.version = String(data.version);
    if (data?.year !== undefined) car.year = String(data.year);
    if (data?.description !== undefined) car.description = data.description ?? null;

    if (data?.mileage !== undefined) {
      car.mileage = data.mileage === '' ? null : Number(data.mileage);
    }
    if (data?.price !== undefined) {
      car.price = data.price === '' ? null : Number(data.price);
    }

    if (Array.isArray(data?.images)) car.images = JSON.stringify(data.images);
    else if (typeof data?.images === 'string') car.images = data.images;

    car.storeId = targetStore.id;

    return this.carRepo.save(car);
  }

  async remove(id: number): Promise<void> {
    await this.carRepo.delete({ id: Number(id) as any });
  }
}