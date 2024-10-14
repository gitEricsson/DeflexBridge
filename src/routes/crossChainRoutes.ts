import { Router } from 'express';
import { initiateTransfer, completeTransfer } from './../controllers/crossChainController';

const router = Router();

router.post('/initiate', initiateTransfer);
router.post('/complete', completeTransfer);

export default router;