import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCarDto, UpdateCarDto } from '../../common/dto';

// ...existing code...
@Injectable()
export class CarsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<any[]> {
    return this.prisma.car.findMany({
      include: { store: { include: { brand: true } } },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number): Promise<any> {
    const car = await this.prisma.car.findUnique({
      where: { id },
      include: { store: { include: { brand: true } } },
    });
    if (!car) throw new NotFoundException('Carro não encontrado');
    return car;
  }

  async create(data: CreateCarDto): Promise<any> {
    console.debug('BACKEND create payload:', data, 'brandId type:', typeof data.brandId, 'storeId type:', typeof data.storeId);

    if (!data || data.storeId === undefined || data.brandId === undefined) {
      throw new BadRequestException('Dados incompletos (brandId/storeId)');
    }

    // tenta resolver brand por id (aceita string numérica) ou por nome
    let brand = null;
    const maybeBrandId = Number(data.brandId);
    if (!Number.isNaN(maybeBrandId)) {
      brand = await this.prisma.brand.findUnique({
        where: { id: maybeBrandId },
        include: { stores: true },
      });
    }
    if (!brand && typeof data.brandId === 'string') {
      brand = await this.prisma.brand.findFirst({
        where: { name: data.brandId },
        include: { stores: true },
      });
    }

    if (!brand) {
      const all = await this.prisma.brand.findMany();
      throw new BadRequestException(`Marca inválida (recebido="${data.brandId}"). Marcas existentes: ${all.map(b => `${b.id}:${b.name}`).join(' | ')}`);
    }

    // valida store
    const storeIdNum = Number(data.storeId);
    const store = await this.prisma.store.findUnique({ where: { id: storeIdNum } });
    if (!store) throw new BadRequestException('Loja inválida');

    if (Number(store.brandId) !== Number(brand.id)) {
      const allowed = (brand.stores || []).map(s => s.name).join(', ') || 'nenhuma loja';
      throw new BadRequestException(`Loja não pertence à marca informada. Lojas permitidas para ${brand.name}: ${allowed}`);
    }

    const mileage = Number(data.mileage);
    const price = Number(data.price);
    if (Number.isNaN(mileage)) throw new BadRequestException('Quilometragem inválida');
    if (Number.isNaN(price)) throw new BadRequestException('Preço inválido');

    return this.prisma.car.create({
      data: {
        model: data.model,
        version: data.version,
        year: data.year,
        mileage,
        price,
        description: data.description || null,
        images: (data as any).images ? JSON.stringify((data as any).images) : null,
        store: { connect: { id: storeIdNum } },
      },
    });
  }

  async update(id: number, data: UpdateCarDto): Promise<any> {
    // validar relação se enviado brandId/storeId
    if (data.brandId !== undefined || data.storeId !== undefined) {
      const brand = data.brandId !== undefined
        ? await this.prisma.brand.findUnique({ where: { id: Number(data.brandId) }, include: { stores: true } })
        : null;

      const store = data.storeId !== undefined
        ? await this.prisma.store.findUnique({ where: { id: Number(data.storeId) } })
        : null;

      if (brand && !store) throw new BadRequestException('Loja inválida');
      if (store && !brand) {
        const storeBrand = await this.prisma.brand.findUnique({ where: { id: Number(store.brandId) }, include: { stores: true } });
        if (!storeBrand) throw new BadRequestException('Marca/Loja inválida');
      }
      if (brand && store && Number(store.brandId) !== Number(brand.id)) {
        const allowed = (brand.stores || []).map(s => s.name).join(', ') || 'nenhuma loja';
        throw new BadRequestException(`Loja não pertence à marca informada. Lojas permitidas para ${brand.name}: ${allowed}`);
      }
    }

    const payload: any = {
      model: data.model,
      version: data.version,
      year: data.year,
      description: data.description,
    };

    if (data.mileage !== undefined) {
      const m = Number(data.mileage);
      if (Number.isNaN(m)) throw new BadRequestException('Quilometragem inválida');
      payload.mileage = m;
    }

    if (data.price !== undefined) {
      const p = Number(data.price);
      if (Number.isNaN(p)) throw new BadRequestException('Preço inválido');
      payload.price = p;
    }

    if ((data as any).images !== undefined) payload.images = (data as any).images ? JSON.stringify((data as any).images) : null;

    return this.prisma.car.update({ where: { id }, data: payload });
  }

  async remove(id: number): Promise<any> {
    const car = await this.prisma.car.findUnique({ where: { id } });
    if (!car) throw new NotFoundException('Carro não encontrado');
    return this.prisma.car.delete({ where: { id } });
  }
}