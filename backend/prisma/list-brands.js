import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const brands = await prisma.brand.findMany({ include: { stores: true } });
  // eslint-disable-next-line no-undef
  console.log(JSON.stringify(brands, null, 2));
  await prisma.$disconnect();
}

// eslint-disable-next-line no-undef
main().catch(e => { console.error(e); process.exit(1); });