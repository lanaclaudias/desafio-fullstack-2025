import { Request, Response } from 'express';
import prisma from '../services/prismaClient';

export const listBrands = async (req: Request, res: Response) => {
  const data = await prisma.brand.findMany();
  res.json({ data });
}

export const listStores = async (req: Request, res: Response) => {
  const brandId = req.query.brandId ? Number(req.query.brandId) : undefined;
  const where = brandId ? { where: { brandId } } : undefined as any;
  const data = brandId ? await prisma.store.findMany(where) : await prisma.store.findMany();
  res.json({ data });
}
