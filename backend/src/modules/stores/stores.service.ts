import { Injectable } from '@nestjs/common';
import { AppDataSource } from '../../data-source';
import { Store } from './store.entity';

@Injectable()
export class StoresService {
  private repo = AppDataSource.getRepository(Store);

  findAll() {
    return this.repo.find({ relations: ['brand'] });
  }

  findByBrandName(name: string) {
    return this.repo.find({ where: { brand: { name } }, relations: ['brand'] } as any);
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['brand'] } as any);
  }
}
