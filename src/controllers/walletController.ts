import { Request, Response } from 'express';
import { WalletService } from '../services/walletService';

const walletService = new WalletService();

export const createWallet = async (req: Request, res: Response) => {
    const { owner } = req.body;
    try {
        const result = await walletService.createWallet(owner);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};