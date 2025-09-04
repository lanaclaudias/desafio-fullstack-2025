"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const carRoutes_1 = __importDefault(require("./routes/carRoutes"));
const metaRoutes_1 = __importDefault(require("./routes/metaRoutes"));
const path_1 = __importDefault(require("path"));

const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(uploadsDir));

app.use((req, _res, next) => { console.log(req.method, req.url); next(); });
app.use('/api/cars', carRoutes_1.default);
app.use('/api', metaRoutes_1.default);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
