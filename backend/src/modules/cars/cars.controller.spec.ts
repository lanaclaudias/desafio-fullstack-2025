/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test } from '@nestjs/testing';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';

describe('CarsController', () => {
  let controller: CarsController;
  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CarsController],
      providers: [{ provide: CarsService, useValue: mockService }],
    }).compile();

    controller = module.get(CarsController);
    jest.clearAllMocks();
  });

  it('findAll -> delega para service.findAll', () => {
    mockService.findAll.mockResolvedValue([]);
    return controller.findAll().then(() => {
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  it('create -> delega para service.create', async () => {
    const dto = { model: 'X', year: '2018', brandId: 1, storeId: 2 };
    mockService.create.mockResolvedValue({ id: 1, ...dto });
    const res = await controller.create(dto as any);
    expect(mockService.create).toHaveBeenCalledWith(dto);
    expect(res).toEqual(expect.objectContaining({ id: 1 }));
  });

  it('update -> delega para service.update', async () => {
    mockService.update.mockResolvedValue({ id: 2 });
    const res = await controller.update(2 as any, { model: 'Z' } as any);
    expect(mockService.update).toHaveBeenCalledWith(2, { model: 'Z' });
    expect(res).toEqual(expect.objectContaining({ id: 2 }));
  });
});