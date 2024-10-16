import { ethers } from 'ethers';
import { Connection, PublicKey } from '@solana/web3.js';
import axios from 'axios';
import winston from 'winston';

// Winston logging setup
const logger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.Console(),
    ],
});

export class GasFeeEstimationService {
    private providers: Map<string, ethers.providers.JsonRpcProvider> = new Map();
    private connection: Connection;

    constructor() {
        this.addProvider('ethereum', 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');
        this.addProvider('bsc', 'https://bsc-dataseed.binance.org/');
        this.addProvider('polygon', 'https://polygon-rpc.com/');
        this.addProvider('avalanche', 'https://api.avax.network/ext/bc/C/rpc');
        this.addProvider('fantom', 'https://rpcapi.fantom.network');
        this.addProvider('optimism', 'https://mainnet.optimism.io');
        this.addProvider('arbitrum', 'https://arb1.arbitrum.io/rpc');
        this.addProvider('solana', 'https://api.mainnet-beta.solana.com/');

        this.connection = new Connection('https://api.mainnet-beta.solana.com');

    }

    addProvider(chain: string, rpcUrl: string): void {
        this.providers.set(chain, new ethers.providers.JsonRpcProvider(rpcUrl));
    }

    async estimateGasFeeWithRetry(chain, to, value, data, retries = 3) {
        let attempt = 0;
        while (attempt < retries) {
            try {
                return await this.estimateGasFee(chain, to, value, data);
            } catch (error) {
                attempt++;
                logger.error(`Error on attempt ${attempt} to estimate gas fee: ${error.message}`);
                if (attempt >= retries) {
                    throw error;
                }
                await new Promise(res => setTimeout(res, attempt * 1000)); // Backoff delay
            }
        }
    }

    async estimateGasFee(chain: string, to: string, value: string, data: string): Promise<bigint> {
        try {
            const provider = this.providers.get(chain);
            if (!provider) {
                logger.error(`Unsupported chain: ${chain}`);
                throw new Error(`Unsupported chain: ${chain}`);
            }

            //Layer-2 network
            if (chain === 'polygon') {
                const response = await axios.get('https://gasstation-mainnet.matic.network/');
                const fastGwei = response.data.fast / 10;
                return BigInt(ethers.utils.parseUnits(fastGwei.toString(), 'gwei').toString());
            }
            

            const gasPrice = await provider.getGasPrice();
            const gasLimit = await provider.estimateGas({
                to,
                value: ethers.utils.parseEther(value),
                data,
            });

            return BigInt(gasPrice.mul(gasLimit).toString());
        } catch (error) {
            logger.error(`Error estimating gas fee on chain ${chain}: ${error.message}`);
            throw error;
        }
    }

    async getOptimizedGasFee(chain: string): Promise<bigint> {
        try {
            if (chain === 'ethereum') {
                const response = await axios.get('https://ethgasstation.info/api/ethgasAPI.json');
                const fastGwei = response.data.fast / 10; // Convert to Gwei
                return BigInt(ethers.utils.parseUnits(fastGwei.toString(), 'gwei').toString());
            } else if (chain === 'bsc') {
                const response = await axios.get('https://bscgas.info/gas');
                return BigInt(ethers.utils.parseUnits(response.data.fast.toString(), 'gwei').toString());
            } else if (chain === 'polygon') {
                const response = await axios.get('https://gasstation-mainnet.matic.network');
                return BigInt(ethers.utils.parseUnits(response.data.fast.toString(), 'gwei').toString());
            } else if (chain === 'avalanche') {
                const gasPrice = await this.providers.get(chain)?.getGasPrice();
                return BigInt(gasPrice.toString());
            } else if (chain === 'fantom') {
                const response = await axios.get('https://gftm.blockscan.com/gasapi.ashx?apikey=key&method=gasoracle');
                return BigInt(ethers.utils.parseUnits(response.data.result.FastGasPrice, 'gwei').toString());
            } else if (chain === 'optimism') {
                const gasPrice = await this.providers.get(chain)?.getGasPrice();
                return BigInt(gasPrice.toString());
            } else if (chain === 'arbitrum') {
                const gasPrice = await this.providers.get(chain)?.getGasPrice();
                return BigInt(gasPrice.toString());
            }else if (chain === 'solana') {
                const solanaRpcUrl = 'https://api.mainnet-beta.solana.com'; 

                // get Solana Recent Blockhash
                const { blockhash } = await this.connection.getLatestBlockhash();

                const response = await axios.post(solanaRpcUrl, {
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'getFeeCalculatorForBlockhash',
                    params: [`${blockhash}`]
                });
                
                const lamportsPerSignature = response.data.result.value.feeCalculator.lamportsPerSignature;
                return BigInt(lamportsPerSignature); // Return fee in lamports (smallest unit of SOL)
            }

            return this.estimateGasFee(chain, '0x0000000000000000000000000000000000000000', '0', '0x');
        } catch (error) {
            logger.error(`Error getting optimized gas fee for chain ${chain}: ${error.message}`);
            throw error;
        }
    }
}
