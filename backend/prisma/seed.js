const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const data = [
  { name: 'BYD', stores: ['BYD Recife', 'BYD Salvador'] },
  { name: 'Hyundai', stores: ['Pateo Afogados', 'Pateo São Luis'] },
  { name: 'Toyota', stores: ['Toyolex Ibiribeira', 'Toyolex Natal'] },
  { name: 'Volkswagen', stores: ['Bremen Recife', 'Bremen João Pessoa'] },
];

async function main() {
  for (const b of data) {
    const brand = await prisma.brand.upsert({
      where: { name: b.name },
      update: {},
      create: { name: b.name },
    });

    for (const sname of b.stores) {
      const existing = await prisma.store.findFirst({
        where: { name: sname, brandId: brand.id },
      });
      if (!existing) {
        await prisma.store.create({
          data: { name: sname, brandId: brand.id },
        });
      }
    }
  }

  console.log('Seed concluído');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });