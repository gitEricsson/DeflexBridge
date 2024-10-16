import { ethers } from 'ethers';
import { CrossChainService } from './crossChainService';
import { GasFeeEstimationService } from './gasFeeService';
import {bridgeConfig} from '../config/bridgeConfig'; // Example of a config file
import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });


export class CrossChainBridgeService {
    private crossChainService: CrossChainService;
    private gasFeeEstimationService: GasFeeEstimationService;
    private bridgeContracts: { [key: string]: { bridgeContractAddress: string; rpcUrl: string } } = {};

    constructor(crossChainService: CrossChainService, gasFeeEstimationService: GasFeeEstimationService) {
        this.crossChainService = crossChainService;
        this.gasFeeEstimationService = gasFeeEstimationService;
        this.bridgeContracts = bridgeConfig;
    }

    async initiateTransfer(fromChain: string, toChain: string, token: string, amount: string, fromAddress: string, toAddress: string): Promise<string> {
        const fromBridgeContract = this.bridgeContracts[fromChain]?.bridgeContractAddress;
        const toBridgeContract = this.bridgeContracts[toChain]?.bridgeContractAddress;
        
        if (!fromBridgeContract || !toBridgeContract) {
            throw new Error(`Bridge contract not found for chains: ${fromChain} or ${toChain}`);
        }

        const gasFee = await this.gasFeeEstimationService.getOptimizedGasFee(fromChain);
        
        // Create a transaction on the ICP canister
        const transaction = await this.crossChainService.createTransaction(fromChain, toChain, fromAddress, toAddress, amount);

   
        const provider = new ethers.providers.JsonRpcProvider(this.bridgeContracts[fromChain].rpcUrl);

        const PRIVATE_KEY = process.env.PRIVATE_KEY; 

        const signer = new ethers.Wallet(PRIVATE_KEY, provider);

        const bridgeContract = new ethers.Contract(fromBridgeContract, [
            // ABI fragment for the bridge contract
            'function initiateTransfer(address recipient, uint256 amount) external',
        ], signer);

        // const tx = await bridgeContract.transfer(toAddress, amount, { gasPrice: gasFee });
        const tx = await bridgeContract.initiateTransfer(toAddress, ethers.utils.parseEther(amount), { gasPrice: gasFee });
        
        await tx.wait();

        // Update the transaction status on the ICP canister
        await this.crossChainService.signTransaction(transaction.id, tx.hash, `${process.env.API_BASE_URL}/complete`);

        return transaction.id;
    }

    async completeTransfer(transactionId: string): Promise<void> {
        const transaction = await this.crossChainService.getTransaction(transactionId);
        if (transaction.status !== 'APPROVED') {
            throw new Error(`Transaction ${transactionId} is not ready for completion`);
        }

        const bridgeContractAddress = this.bridgeContracts[transaction.toChain]?.bridgeContractAddress

        if (!bridgeContractAddress) {
            throw new Error(`Unsupported chain: ${transaction.toChain}`);
        }

        // Complete the transfer on the destination chain
        // This is a simplified example. In a real-world scenario, you'd interact with the actual bridge contract
        const provider = new ethers.providers.JsonRpcProvider(`https://${transaction.toChain}.infura.io/v3/YOUR_INFURA_PROJECT_ID`);
        const signer = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);
        
        const bridgeContract = new ethers.Contract(bridgeContractAddress, ['function completeTransfer(address to, uint256 amount)'], signer);

        const tx = await bridgeContract.completeTransfer(transaction.toAddress, transaction.amount);
        await tx.wait();

        // Update the transaction status on the ICP canister
        await this.crossChainService.updateTransactionStatus(transactionId, `${process.env.API_BASE_URL}/initiate`);
    }
}