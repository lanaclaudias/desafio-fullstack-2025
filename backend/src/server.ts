import express from 'express';
import cors from 'cors';
import carRoutes from './routes/carRoutes';
import metaRoutes from './routes/metaRoutes';
import path from 'path';


const uploadsDir = path.join(process.cwd(), 'uploads');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));


app.use((req, _res, next) => { console.log(req.method, req.url); next(); });

app.use('/api/cars', carRoutes);
app.use('/api', metaRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
