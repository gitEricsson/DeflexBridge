import { ethers } from 'ethers';
import axios from 'axios';

export class GasFeeEstimationService {
    private providers: Map<string, ethers.providers.JsonRpcProvider> = new Map();

    constructor() {
        this.providers.set('ethereum', new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'));
        this.providers.set('bsc', new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/'));
        // Add more providers for other chains as needed
    }

    async estimateGasFee(chain: string, to: string, value: string, data: string): Promise<bigint> {
        const provider = this.providers.get(chain);
        if (!provider) {
            throw new Error(`Unsupported chain: ${chain}`);
        }

        const gasPrice = await provider.getGasPrice();
        const gasLimit = await provider.estimateGas({
            to,
            value: ethers.utils.parseEther(value),
            data,
        });

        return BigInt(gasPrice.mul(gasLimit).toString());
    }

    async getOptimizedGasFee(chain: string): Promise<bigint> {
        if (chain === 'ethereum') {
            const response = await axios.get('https://ethgasstation.info/api/ethgasAPI.json');
            const fastGwei = response.data.fast / 10; // Convert to Gwei
            return BigInt(ethers.utils.parseUnits(fastGwei.toString(), 'gwei').toString());
        }
        // Add optimized fee estimations for other chains
        return this.estimateGasFee(chain, '0x0000000000000000000000000000000000000000', '0', '0x');
    }
}