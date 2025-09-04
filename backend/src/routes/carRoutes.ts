import { Router } from 'express';
import * as carController from '../controllers/carController';
import upload from '../services/upload';

const router = Router();

router.get('/', carController.listCars);
router.post('/', upload.array('images'), carController.createCar);
router.get('/:id', carController.getCar);
router.put('/:id', upload.array('images'), carController.updateCar);
router.delete('/:id', carController.deleteCar);

export default router;
