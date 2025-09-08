import AppDataSource from './data-source';
import { Brand } from './modules/brands/brand.entity';
import { Store } from './modules/stores/store.entity';

async function seed() {
  await AppDataSource.initialize();
  const brandRepo = AppDataSource.getRepository(Brand);
  const storeRepo = AppDataSource.getRepository(Store);

 
  try {
    const _carRepo = AppDataSource.getRepository('Car');
    await _carRepo.clear();
  } catch (err) {

  }
  try {
    await storeRepo.clear();
  } catch (err) {}
  try {
    await brandRepo.clear();
  } catch (err) {}

  const brandsData = [
  { name: 'BYD', stores: ['BYD Recife', 'BYD Salvador'] },
  { name: 'Hyundai', stores: ['Pateo Afogados', 'Pateo São Luis'] },
  { name: 'Toyota', stores: ['Toyolex Ibiribeira', 'Toyolex Natal'] },
  { name: 'Volkswagen', stores: ['Bremen Recife', 'Bremen João Pessoa'] },
  ];

  for (const b of brandsData) {
    let brand = await brandRepo.findOne({ where: { name: b.name } } as any);
    if (!brand) brand = brandRepo.create({ name: b.name });
    await brandRepo.save(brand);
    for (const s of b.stores) {
      const exists = await storeRepo.findOne({ where: { name: s } } as any);
      if (!exists) {
        const store = storeRepo.create({ name: s, brand });
        await storeRepo.save(store);
      }
    }
  }


  console.log('Seed complete');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
