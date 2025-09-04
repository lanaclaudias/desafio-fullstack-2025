import prisma from './prismaClient';

const normalizeCar = (c:any) => ({
  ...c,
  images: c.images ? JSON.parse(c.images) : []
})

export const listCars = async () => {
  const rows = await prisma.car.findMany({ include: { brand: true, store: true } });
  return rows.map(normalizeCar);
}

export const getCar = async (id: number) => {
  const r = await prisma.car.findUnique({ where: { id }, include: { brand: true, store: true } });
  if(!r) return null;
  return normalizeCar(r);
}

export const createCar = async (data:any) => {
  const store = await prisma.store.findUnique({ where: { id: Number(data.storeId) } });
  if(!store) throw new Error('Loja não encontrada');
  if(store.brandId !== Number(data.brandId)) throw new Error('Loja não pertence à marca selecionada');

  const created = await prisma.car.create({ data: {
    model: data.model,
    year: String(data.year || ''),
    version: data.version || null,
    mileage: data.mileage || null,
    description: data.description || null,
    images: data.images ? JSON.stringify(data.images) : null,
    price: Number(data.price || 0),
    brandId: Number(data.brandId),
    storeId: Number(data.storeId)
  } });


  const full = await prisma.car.findUnique({ where: { id: created.id }, include: { brand: true, store: true } });
  return normalizeCar(full);
}

export const updateCar = async (id:number, data:any) => {
  const store = await prisma.store.findUnique({ where: { id: Number(data.storeId) } });
  if(!store) throw new Error('Loja não encontrada');
  if(store.brandId !== Number(data.brandId)) throw new Error('Loja não pertence à marca selecionada');

  await prisma.car.update({ where: { id }, data: {
    model: data.model,
    year: String(data.year || ''),
    version: data.version || null,
    mileage: data.mileage || null,
    description: data.description || null,
    images: data.images ? JSON.stringify(data.images) : undefined,
    price: Number(data.price || 0),
    brandId: Number(data.brandId),
    storeId: Number(data.storeId)
  } });

  const updated = await prisma.car.findUnique({ where: { id }, include: { brand: true, store: true } });
  if(!updated) throw new Error('Erro ao atualizar carro');
  return normalizeCar(updated);
}

export const deleteCar = async (id:number) => {
  return prisma.car.delete({ where: { id } });
}
