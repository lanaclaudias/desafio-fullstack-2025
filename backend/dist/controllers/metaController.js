"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listStores = exports.listBrands = void 0;
const prismaClient_1 = __importDefault(require("../services/prismaClient"));
const listBrands = async (req, res) => {
    const data = await prismaClient_1.default.brand.findMany();
    res.json({ data });
};
exports.listBrands = listBrands;
const listStores = async (req, res) => {
    const brandId = req.query.brandId ? Number(req.query.brandId) : undefined;
    const where = brandId ? { where: { brandId } } : undefined;
    const data = brandId ? await prismaClient_1.default.store.findMany(where) : await prismaClient_1.default.store.findMany();
    res.json({ data });
};
exports.listStores = listStores;
