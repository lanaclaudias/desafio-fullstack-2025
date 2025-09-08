import { Injectable } from '@nestjs/common';
import { AppDataSource } from '../../data-source';
import { Brand } from './brand.entity';

@Injectable()
export class BrandsService {
  private repo = AppDataSource.getRepository(Brand);

  findAll() {
    return this.repo.find({ relations: ['stores'] });
  }
}
