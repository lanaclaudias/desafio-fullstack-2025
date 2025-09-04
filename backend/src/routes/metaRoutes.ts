import { Router } from 'express';
import * as metaController from '../controllers/metaController';

const router = Router();

router.get('/brands', metaController.listBrands);
router.get('/stores', metaController.listStores);

export default router;
