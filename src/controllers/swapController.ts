import { Request, Response } from 'express';
import { LiquidityPoolService } from '../services/liquidityPoolService';

const liquidityPoolService = new LiquidityPoolService();

export const swap = async (req: Request, res: Response) => {
    const { poolId, amountIn, tokenInId, minAmountOut } = req.body;
    try {
        const result = await liquidityPoolService.swap(poolId, BigInt(amountIn), tokenInId, BigInt(minAmountOut));
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};