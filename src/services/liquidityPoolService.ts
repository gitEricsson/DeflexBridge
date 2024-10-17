import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../declarations/crossChain.did';
import { getCanisterId } from './../utils/canisterUtils';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });


export class LiquidityPoolService {
    private actor: any;
    private supportedChains = ['ethereum', 'bsc', 'polygon', 'avalanche', 'base', 'optimism', 'arbitrum'];


    constructor() {
        const agent = new HttpAgent();
        this.actor = Actor.createActor(idlFactory, { agent, canisterId: getCanisterId('liquidityPool') });
    }

    async getPool(id: string) {
        return this.actor.getPool(id);
    }

    async createPool(token0Id: string, token1Id: string) {
        return this.actor.createPool(token0Id, token1Id);
    }

    async addLiquidity(poolId: string, amount0: bigint, amount1: bigint) {
        return this.actor.addLiquidity(poolId, amount0, amount1);
    }

    async removeLiquidity(positionId: string, shares: bigint) {
        return this.actor.removeLiquidity(positionId, shares);
    }

    async getAmountOut(poolId: string, amountIn: bigint, tokenInId: string) {
        return this.actor.getAmountOut(poolId, amountIn, tokenInId);
    }

    async swap(poolId: string, amountIn: bigint, tokenInId: string, minAmountOut: bigint) {
        return this.actor.swap(poolId, amountIn, tokenInId, minAmountOut);
    }

    async getRate(chain: string, fromToken: string, toToken: string, amount: string): Promise<bigint> {
        try {
            if (this.supportedChains.includes(chain)) {

                const chainId = this.get0xApiId(chain);

                const url = 'https://api.0x.org/swap/permit2/quote';
                const params = {
                  chainId: chainId,
                  sellToken: fromToken,
                  buyToken: toToken,
                  sellAmount: amount
                };
                const headers = {
                  '0x-api-key': process.env.OX_API_KEY,
                };
              
                  const response = await axios.get(url, { params, headers });
        
                    // Extract the price from the response
                    const { totalNetworkFee } = response.data;
                    return BigInt(Math.floor(Number(totalNetworkFee) * 1e18)); //  
                }else {
                throw new Error(`Unsupported chain: ${chain}`);}
            } catch (error) {
            console.error(`Error fetching rate for ${chain}: ${error.message}`);
            throw new Error('Failed to fetch swap rate');
    }
}

    private get0xApiId(chain: string): string {
        switch (chain) {
            case 'ethereum':
                return '1';
            case 'bsc':
                return '56';
            case 'polygon':
                return '137';
            case 'avalanche':
                return '43114';
            case 'optimism':
                return '10';
            case 'base':
                return '8453';
            case 'arbitrum':
                return '42161';
            default:
                throw new Error(`Unsupported chain for 0x API: ${chain}`);
        }
    }
}