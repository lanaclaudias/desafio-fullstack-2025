const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const brands = await prisma.brand.findMany({ include: { stores: true } });
  console.log(JSON.stringify(brands, null, 2));
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });