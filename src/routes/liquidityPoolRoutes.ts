import { Router } from 'express';
import { addLiquidity, removeLiquidity, swap } from './../controllers/liquidityPoolController';

const router = Router();

router.post('/add', addLiquidity);
router.post('/remove', removeLiquidity);
router.post('/swap', swap);


export default router;