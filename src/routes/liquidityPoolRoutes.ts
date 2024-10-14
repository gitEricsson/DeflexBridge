import { Router } from 'express';
import { addLiquidity, removeLiquidity } from './../controllers/liquidityPoolController';

const router = Router();

router.post('/add', addLiquidity);
router.post('/remove', removeLiquidity);

export default router;