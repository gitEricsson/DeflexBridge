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

export const getWallet = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await walletService.getWallet(id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateWalletBalance = async (req: Request, res: Response) => {
    const { id, amount } = req.body;
    try {
        const result = await walletService.updateWalletBalance(id, BigInt(amount));
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteWallet = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await walletService.deleteWallet(id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
