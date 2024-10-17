import { Router } from 'express';
import {
    createWallet,
    getWallet,
    updateWalletBalance,
    deleteWallet
} from './../controllers/walletController';

const router = Router();

router.post('/', createWallet);
router.get('/:id', getWallet);
router.put('/balance', updateWalletBalance);
router.delete('/:id', deleteWallet);

export default router;
