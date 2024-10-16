import { Request, Response } from 'express';
import { LiquidityPoolService } from '../services/liquidityPoolService';

const liquidityPoolService = new LiquidityPoolService();

export const addLiquidity = async (req: Request, res: Response) => {
    const { poolId, amount0, amount1 } = req.body;
    try {
        const result = await liquidityPoolService.addLiquidity(poolId, BigInt(amount0), BigInt(amount1));
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const removeLiquidity = async (req: Request, res: Response) => {
    const { positionId, shares } = req.body;
    try {
        const result = await liquidityPoolService.removeLiquidity(positionId, BigInt(shares));
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const swap = async (req: Request, res: Response) => {
    const { poolId, amountIn, tokenInId, minAmountOut } = req.body;
    try {
        const result = await liquidityPoolService.swap(poolId, BigInt(amountIn), tokenInId, BigInt(minAmountOut));
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};