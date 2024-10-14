import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../declarations/exchange.did';
import { getCanisterId } from './../utils/canisterUtils';

export class ExchangeService {
  private actor: any;

  constructor() {
    const agent = new HttpAgent();
    this.actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: getCanisterId('exchange'),
    });
  }

  async getExchange(id: string) {
    return this.actor.getExchange(id);
  }

  async createExchange(
    fromToken: string,
    toToken: string,
    amount: bigint,
    rate: bigint
  ) {
    return this.actor.createExchange(fromToken, toToken, amount, rate);
  }

  async updateExchangeStatus(id: string, status: string) {
    return this.actor.updateExchangeStatus(id, status);
  }
}
