import { Actor, Identity, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../declarations/wallet.did';
import { getCanisterId } from './../utils/canisterUtils';

export class WalletService {
  private actor: any;

  constructor() {
    const agent = new HttpAgent();

    this.actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: getCanisterId('wallet'),
    });
  }

  async getWallet(id: string) {
    return this.actor.getWallet(id);
  }

  async createWallet(owner: string) {
    const existingWallet = await this.actor.getWalletByOwner(owner);
    if (existingWallet.Ok) {
      throw new Error(`Wallet for owner ${owner} already exists.`);
    }
    return this.actor.createWallet(owner);
  }

  async updateWalletBalance(id: string, amount: bigint) {
    return this.actor.updateWalletBalance(id, amount);
  }

  async deleteWallet(id: string) {
    return this.actor.deleteWallet(id);
  }
}


// // src/canisters/wallet/wallet.ts
// import { Principal } from "@dfinity/agent";

// export interface Wallet {
//     balance: Map<string, number>;
//     owner: Principal;
// }

// export class WalletService {
//     private wallets: Map<Principal, Wallet> = new Map();

//     createWallet(owner: Principal): Wallet {
//         const newWallet: Wallet = { balance: new Map(), owner };
//         this.wallets.set(owner, newWallet);
//         return newWallet;
//     }

//     getBalance(walletOwner: Principal, token: string): number {
//         const wallet = this.wallets.get(walletOwner);
//         return wallet?.balance.get(token) || 0;
//     }

//     deposit(walletOwner: Principal, token: string, amount: number): void {
//         const wallet = this.wallets.get(walletOwner);
//         if (wallet) {
//             const currentBalance = wallet.balance.get(token) || 0;
//             wallet.balance.set(token, currentBalance + amount);
//         }
//     }

//     withdraw(walletOwner: Principal, token: string, amount: number): boolean {
//         const wallet = this.wallets.get(walletOwner);
//         if (wallet) {
//             const currentBalance = wallet.balance.get(token) || 0;
//             if (currentBalance >= amount) {
//                 wallet.balance.set(token, currentBalance - amount);
//                 return true;
//             }
//         }
//         return false;
//     }
// }
