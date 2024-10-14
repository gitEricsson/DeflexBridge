import { Router } from 'express';
import { swap } from './../controllers/swapController';

const router = Router();

router.post('/', swap);

export default router;