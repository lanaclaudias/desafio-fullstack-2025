"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function () { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function (o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function (o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCar = exports.updateCar = exports.getCar = exports.createCar = exports.listCars = void 0;
const carService = __importStar(require("../services/carService"));
const listCars = async (req, res) => {
    try {
        const data = await carService.listCars();
        res.json({ data });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.listCars = listCars;
const createCar = async (req, res) => {
    try {
        const body = req.body || {};
        const files = req.files || [];
        if (files.length)
            body.images = files.map(f => `${req.protocol}://${req.get('host')}/uploads/${f.filename}`);
        const data = await carService.createCar(body);
        res.status(201).json({ data });
    }
    catch (e) {
        res.status(400).json({ error: e.message });
    }
};
exports.createCar = createCar;
const getCar = async (req, res) => {
    try {
        const data = await carService.getCar(Number(req.params.id));
        if (!data)
            return res.status(404).json({ error: 'Carro não encontrado' });
        res.json({ data });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.getCar = getCar;
const updateCar = async (req, res) => {
    try {
        const body = req.body || {};
        const files = req.files || [];
        if (files.length)
            body.images = files.map(f => `${req.protocol}://${req.get('host')}/uploads/${f.filename}`);
        const data = await carService.updateCar(Number(req.params.id), body);
        res.json({ data });
    }
    catch (e) {
        res.status(400).json({ error: e.message });
    }
};
exports.updateCar = updateCar;
const deleteCar = async (req, res) => {
    try {
        await carService.deleteCar(Number(req.params.id));
        res.status(204).send();
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};
exports.deleteCar = deleteCar;
