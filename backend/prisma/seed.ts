import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main(){
  await prisma.car.deleteMany()
  await prisma.store.deleteMany()
  await prisma.brand.deleteMany()

  const byd = await prisma.brand.create({ data: { name: 'BYD' } })
  const hy = await prisma.brand.create({ data: { name: 'Hyundai' } })
  const toy = await prisma.brand.create({ data: { name: 'Toyota' } })
  const vw = await prisma.brand.create({ data: { name: 'Volkswagen' } })

  await prisma.store.createMany({ data: [
    { name: 'BYD Recife', brandId: byd.id },
    { name: 'BYD Salvador', brandId: byd.id },
    { name: 'Pateo Afogados', brandId: hy.id },
    { name: 'Pateo São Luis', brandId: hy.id },
    { name: 'Toyolex Ibiribeira', brandId: toy.id },
    { name: 'Toyolex Natal', brandId: toy.id },
    { name: 'Bremen Recife', brandId: vw.id },
    { name: 'Bremen João Pessoa', brandId: vw.id }
  ]})
}

main().catch(e=> console.error(e)).finally(()=> prisma.$disconnect())
