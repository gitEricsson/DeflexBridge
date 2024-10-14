import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../declarations/crossChain.did';
import { getCanisterId } from './../utils/canisterUtils';

export class CrossChainService {
  private actor: any;

  constructor() {
    const agent = new HttpAgent();
    this.actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: getCanisterId('crossChain'),
    });
  }

  async getTransaction(id: string) {
    return this.actor.getTransaction(id);
  }

  async createTransaction(
    fromChain: string,
    toChain: string,
    fromAddress: string,
    toAddress: string,
    amount: bigint
  ) {
    return this.actor.createTransaction(
      fromChain,
      toChain,
      fromAddress,
      toAddress,
      amount
    );
  }

  async signTransaction(id: string, signature: string) {
    return this.actor.signTransaction(id, signature);
}

async executeTransaction(id: string) {
    return this.actor.executeTransaction(id);
}

  async updateTransactionStatus(id: string, status: string) {
    return this.actor.updateTransactionStatus(id, status);
  }
}
