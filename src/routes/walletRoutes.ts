import { Router } from 'express';
import { createWallet } from './../controllers/walletController';

const router = Router();

router.post('/', createWallet);

export default router;