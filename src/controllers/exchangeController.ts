import { Request, Response } from 'express';
import { ExchangeService } from '../services/exchangeService';

const exchangeService = new ExchangeService();

export const createExchange = async (req: Request, res: Response) => {
    const {chain, fromToken, toToken, amount } = req.body;
    try {
        const result = await exchangeService.createExchange(chain, fromToken, toToken, amount);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getExchange = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await exchangeService.getExchange(id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
