/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CarsService } from './cars.service';

describe('CarsService', () => {
  let service: CarsService;

  const mockCarRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };
  const mockStoreRepo = { findOne: jest.fn() };
  const mockBrandRepo = { find: jest.fn() };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CarsService],
    }).compile();

    service = module.get(CarsService);
    (service as any).carRepo = mockCarRepo;
    (service as any).storeRepo = mockStoreRepo;
    (service as any).brandRepo = mockBrandRepo;

    jest.clearAllMocks();
  });

  it('create -> deve falhar quando store não existe', async () => {
    mockStoreRepo.findOne.mockResolvedValue(undefined);
    await expect(service.create({ storeId: 999 })).rejects.toThrow(BadRequestException);
  });

  it('create -> deve falhar quando brand não pertence à store', async () => {
    mockStoreRepo.findOne.mockResolvedValue({ id: 2, brand: { id: 5 } });
    mockBrandRepo.find.mockResolvedValue([{ id: 1, name: 'BYD' }]);
    await expect(service.create({ storeId: 2, brandId: 1 })).rejects.toThrow(BadRequestException);
  });

  it('create -> salva carro quando store e brand válidos', async () => {
    mockStoreRepo.findOne.mockResolvedValue({ id: 2, brand: { id: 1 } });
    mockCarRepo.create.mockReturnValue({ model: 'X' });
    mockCarRepo.save.mockResolvedValue({ id: 1, model: 'X' });

    const dto: any = { model: 'X', year: '2018', brandId: 1, storeId: 2 };
    const res = await service.create(dto);
    expect(mockCarRepo.create).toHaveBeenCalled();
    expect(mockCarRepo.save).toHaveBeenCalled();
    expect(res).toEqual(expect.objectContaining({ id: 1, model: 'X' }));
  });

  it('update -> lança NotFoundException quando carro não existe', async () => {
    mockCarRepo.findOne.mockResolvedValue(undefined);
    await expect(service.update(999, { model: 'Y' })).rejects.toThrow(NotFoundException);
  });

  it('update -> altera storeId quando informado', async () => {
    const existing = { id: 5, store: { id: 2, brand: { id: 1 } }, storeId: 2 };
    mockCarRepo.findOne.mockResolvedValue(existing);
    mockStoreRepo.findOne.mockResolvedValue({ id: 3, brand: { id: 1 } });
    mockCarRepo.save.mockResolvedValue({ id: 5, storeId: 3 });

    const res = await service.update(5, { storeId: 3 });
    expect(mockCarRepo.save).toHaveBeenCalled();
    expect(res).toEqual(expect.objectContaining({ storeId: 3 }));
  });

  it('remove -> chama delete no repositório', async () => {
    mockCarRepo.delete.mockResolvedValue(undefined);
    await service.remove(10);
    expect(mockCarRepo.delete).toHaveBeenCalledWith({ id: 10 });
  });
});