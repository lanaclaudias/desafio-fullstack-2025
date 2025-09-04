
import { Request, Response } from 'express';
import * as carService from '../services/carService'

export const listCars = async (req: Request, res: Response) => {
  try{
    const data = await carService.listCars()
    res.json({ data })
  }catch(e:any){ res.status(500).json({ error: e.message }) }
}

export const createCar = async (req: Request, res: Response) => {
  try{
  const body:any = req.body || {}
  const files = ((req as any).files as any[] | undefined) || []
  const existingJson = body.imagesExisting ? body.imagesExisting : undefined
  const existing = existingJson ? JSON.parse(existingJson) : []
  const uploaded = files.length ? files.map(f=> `${req.protocol}://${req.get('host')}/uploads/${f.filename}`) : []
  const merged = [...(Array.isArray(existing) ? existing : []), ...uploaded]
  if(merged.length) body.images = merged
  const data = await carService.createCar(body)
    res.status(201).json({ data })
  }catch(e:any){ res.status(400).json({ error: e.message }) }
}

export const getCar = async (req: Request, res: Response) => {
  try{
    const data = await carService.getCar(Number(req.params.id))
    if(!data) return res.status(404).json({ error: 'Carro não encontrado' })
    res.json({ data })
  }catch(e:any){ res.status(500).json({ error: e.message }) }
}

export const updateCar = async (req: Request, res: Response) => {
  try{
  const body:any = req.body || {}
  const files = ((req as any).files as any[] | undefined) || []
  const existingJson = body.imagesExisting ? body.imagesExisting : undefined
  const existing = existingJson ? JSON.parse(existingJson) : []
  const uploaded = files.length ? files.map(f=> `${req.protocol}://${req.get('host')}/uploads/${f.filename}`) : []
  const merged = [...(Array.isArray(existing) ? existing : []), ...uploaded]
  if(merged.length) body.images = merged
  const data = await carService.updateCar(Number(req.params.id), body)
    res.json({ data })
  }catch(e:any){ res.status(400).json({ error: e.message }) }
}

export const deleteCar = async (req: Request, res: Response) => {
  try{
    await carService.deleteCar(Number(req.params.id))
    res.status(204).send()
  }catch(e:any){ res.status(500).json({ error: e.message }) }
}
