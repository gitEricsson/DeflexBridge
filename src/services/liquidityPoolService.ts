import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../declarations/crossChain.did';
import { getCanisterId } from './../utils/canisterUtils';

export class LiquidityPoolService {
    private actor: any;

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
}