import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.car.deleteMany().catch(() => {});
  await prisma.store.deleteMany().catch(() => {});
  await prisma.brand.deleteMany().catch(() => {});

  const byd = await prisma.brand.create({ data: { name: 'BYD' } });
  const hyu = await prisma.brand.create({ data: { name: 'Hyundai' } });
  const toy = await prisma.brand.create({ data: { name: 'Toyota' } });
  const vw  = await prisma.brand.create({ data: { name: 'Volkswagen' } });

  await prisma.store.createMany({
    data: [
      { name: 'BYD Recife', brandId: byd.id },
      { name: 'BYD Salvador', brandId: byd.id },
      { name: 'Pateo Afogados', brandId: hyu.id },
      { name: 'Pateo São Luis', brandId: hyu.id },
      { name: 'Toyolex Ibiribeira', brandId: toy.id },
      { name: 'Toyolex Natal', brandId: toy.id },
      { name: 'Bremen Recife', brandId: vw.id },
      { name: 'Bremen João Pessoa', brandId: vw.id },
    ],
  });

 
}

main().finally(() => prisma.$disconnect());