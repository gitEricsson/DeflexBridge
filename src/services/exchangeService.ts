import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../declarations/exchange.did';
import { getCanisterId } from './../utils/canisterUtils';
import { LiquidityPoolService } from './liquidityPoolService';


export class ExchangeService {
  private actor: any;
  private liquidityPoolService:  LiquidityPoolService


  constructor() {
    const agent = new HttpAgent();
    this.actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: getCanisterId('exchange'),
    });
    this.liquidityPoolService = new LiquidityPoolService();
    
  }

  async getExchange(id: string) {
    return this.actor.getExchange(id);
  }

  async createExchange(
    chain: string,
    fromToken: string,
    toToken: string,
    amount: string,
  ) {
    const rate = await this.liquidityPoolService.getRate(chain, fromToken, toToken, amount); // Fetch rate dynamically

    const result = this.actor.createExchange(fromToken, toToken, amount, rate);

    if (result.Err) {
      throw new Error(result.Err);
    }
    return result
  } catch (error) {
    throw new Error(`Failed to create exchange: ${error.message}`);
  }

  async updateExchangeStatus(id: string, status: string) {
    return this.actor.updateExchangeStatus(id, status);
  }
}
