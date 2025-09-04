"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCar = exports.updateCar = exports.createCar = exports.getCar = exports.listCars = void 0;
const prismaClient_1 = __importDefault(require("./prismaClient"));
const normalizeCar = (c) => ({
    ...c,
    images: c.images ? JSON.parse(c.images) : []
});
const listCars = async () => {
    const rows = await prismaClient_1.default.car.findMany({ include: { brand: true, store: true } });
    return rows.map(normalizeCar);
};
exports.listCars = listCars;
const getCar = async (id) => {
    const r = await prismaClient_1.default.car.findUnique({ where: { id }, include: { brand: true, store: true } });
    if (!r)
        return null;
    return normalizeCar(r);
};
exports.getCar = getCar;
const createCar = async (data) => {
    const store = await prismaClient_1.default.store.findUnique({ where: { id: Number(data.storeId) } });
    if (!store)
        throw new Error('Loja não encontrada');
    if (store.brandId !== Number(data.brandId))
        throw new Error('Loja não pertence à marca selecionada');
    const created = await prismaClient_1.default.car.create({ data: {
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
 
    const full = await prismaClient_1.default.car.findUnique({ where: { id: created.id }, include: { brand: true, store: true } });
    return normalizeCar(full);
};
exports.createCar = createCar;
const updateCar = async (id, data) => {
    const store = await prismaClient_1.default.store.findUnique({ where: { id: Number(data.storeId) } });
    if (!store)
        throw new Error('Loja não encontrada');
    if (store.brandId !== Number(data.brandId))
        throw new Error('Loja não pertence à marca selecionada');
    await prismaClient_1.default.car.update({ where: { id }, data: {
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
    const updated = await prismaClient_1.default.car.findUnique({ where: { id }, include: { brand: true, store: true } });
    if (!updated)
        throw new Error('Erro ao atualizar carro');
    return normalizeCar(updated);
};
exports.updateCar = updateCar;
const deleteCar = async (id) => {
    return prismaClient_1.default.car.delete({ where: { id } });
};
exports.deleteCar = deleteCar;
