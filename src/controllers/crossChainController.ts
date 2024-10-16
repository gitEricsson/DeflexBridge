import { Request, Response } from 'express';
import { CrossChainBridgeService } from '../services/crossChainBridgeService';
import { CrossChainService } from '../services/crossChainService';
import { GasFeeEstimationService } from '../services/gasFeeService';

const crossChainService = new CrossChainService();
const gasFeeEstimationService = new GasFeeEstimationService();
const crossChainBridgeService = new CrossChainBridgeService(crossChainService, gasFeeEstimationService);

export const initiateTransfer = async (req: Request, res: Response) => {
    const { fromChain, toChain, token, amount, fromAddress, toAddress } = req.body;
    try {
        const transactionId = await crossChainBridgeService.initiateTransfer(fromChain, toChain, token, amount, fromAddress, toAddress);
        res.json({ success: true, transactionId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const completeTransfer = async (req: Request, res: Response) => {
    const { transactionId } = req.body;
    try {
        await crossChainBridgeService.completeTransfer(transactionId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};