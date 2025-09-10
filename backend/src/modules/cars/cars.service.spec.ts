/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test } from '@nestjs/testing';
import { CarsService } from './cars.service';

describe('CarsService', () => {
  let service: CarsService;
  const mockCarRepo = { create: jest.fn(), save: jest.fn() };
  const mockStoreRepo = { findOne: jest.fn() };
  const mockBrandRepo = { find: jest.fn() };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CarsService],
    }).compile();

    service = module.get(CarsService);
    // injeta os mocks nas propriedades privadas
    (service as any).carRepo = mockCarRepo;
    (service as any).storeRepo = mockStoreRepo;
    (service as any).brandRepo = mockBrandRepo;
  });

  afterEach(() => jest.clearAllMocks());

  it('should create car when store exists', async () => {
    mockStoreRepo.findOne.mockResolvedValue({ id: 2, brand: { id: 1 } });
    mockCarRepo.create.mockReturnValue({ model: 'X' });
    mockCarRepo.save.mockResolvedValue({ id: 1, model: 'X' });

    const dto: any = { model: 'X', year: '2018', brandId: 1, storeId: 2 };
    const res = await service.create(dto);
    expect(mockCarRepo.save).toHaveBeenCalled();
    // <-- use expect.objectContaining do Jest, não jasmine.objectContaining
    expect(res).toEqual(expect.objectContaining({ id: 1, model: 'X' }));
  });
});