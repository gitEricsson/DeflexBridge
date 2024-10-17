// import {
//   query,
//   update,
//   StableBTreeMap,
// } from 'azle';
// import { v4 as uuidv4 } from 'uuid';

// type Exchange = {
//   id: string;
//   fromToken: string;
//   toToken: string;
//   amount: bigint; // Use bigint instead of nat64
//   rate: bigint;
//   status: string;
//   createdAt: bigint;
//   updatedAt: bigint;
// };

// const exchangeStorage = StableBTreeMap<string, Exchange>(0);

// query;
// export function getExchange(id: string): { Ok?: Exchange; Err?: string } {
//   const exchange = exchangeStorage.get(id);
//   return exchange
//     ? { Ok: exchange }
//     : { Err: `Exchange with id=${id} not found` };
// }

// update;
// export function createExchange(
//   fromToken: string,
//   toToken: string,
//   amount: bigint,
//   rate: bigint
// ): { Ok?: Exchange; Err?: string } {
//   const exchange: Exchange = {
//     id: uuidv4(),
//     fromToken,
//     toToken,
//     amount,
//     rate,
//     status: 'PENDING',
//     createdAt: BigInt(Date.now()), // Replace ic.time() with BigInt(Date.now())
//     updatedAt: BigInt(Date.now()),
//   };
//   exchangeStorage.insert(exchange.id, exchange);
//   return { Ok: exchange };
// }

// update;
// export function updateExchangeStatus(
//   id: string,
//   status: string
// ): { Ok?: Exchange; Err?: string } {
//   const exchange = exchangeStorage.get(id);
//   if (!exchange) {
//     return { Err: `Exchange with id=${id} not found` };
//   }

//   const updatedExchange: Exchange = {
//     ...exchange,
//     status,
//     updatedAt: BigInt(Date.now()),
//   };
//   exchangeStorage.insert(exchange.id, updatedExchange);
//   return { Ok: updatedExchange };
// }

////////////////////////////////////////////////////////////////////////////////////////

import { IDL, query, update, StableBTreeMap } from 'azle';
import { v4 as uuidv4 } from 'uuid';

const ExchangeIDL = IDL.Record({
    id: IDL.Text,
    fromToken: IDL.Text,
    toToken: IDL.Text,
    amount: IDL.Nat64,
    rate: IDL.Nat64,
    status: IDL.Text,
    createdAt: IDL.Nat64,
    updatedAt: IDL.Nat64,
});

class ExchangeCanister {
    private exchangeStorage = StableBTreeMap<string, Exchange>(0);

    @query([IDL.Text], IDL.Variant({ Ok: ExchangeIDL, Err: IDL.Text }))
    getExchange(id: string): { Ok?: Exchange; Err?: string } {
        const exchange = this.exchangeStorage.get(id);
        return exchange
            ? { Ok: exchange }
            : { Err: `Exchange with id=${id} not found` };
    }

    @update([IDL.Text, IDL.Text, IDL.Nat64], IDL.Variant({ Ok: ExchangeIDL, Err: IDL.Text }))
    async createExchange(
        fromToken: string,
        toToken: string,
        amount: bigint,
        rate: bigint
    ): Promise<{ Ok?: Exchange; Err?: string }> {
        try {

            const exchange: Exchange = {
                id: uuidv4(),
                fromToken,
                toToken,
                amount,
                rate,
                status: 'PENDING',
                createdAt: BigInt(Date.now()),
                updatedAt: BigInt(Date.now()),
            };
            this.exchangeStorage.insert(exchange.id, exchange);
            return { Ok: exchange };
        } catch (error) {
            return { Err: `Error creating exchange: ${error.message}` };
        }
    }

    @update([IDL.Text, IDL.Text], IDL.Variant({ Ok: ExchangeIDL, Err: IDL.Text }))
    updateExchangeStatus(
        id: string,
        status: string
    ): { Ok?: Exchange; Err?: string } {
        const exchange = this.exchangeStorage.get(id);
        if (!exchange) {
            return { Err: `Exchange with id=${id} not found` };
        }

        const updatedExchange: Exchange = {
            ...exchange,
            status,
            updatedAt: BigInt(Date.now()),
        };
        this.exchangeStorage.insert(exchange.id, updatedExchange);
        return { Ok: updatedExchange };
    }
}


type Exchange = {
    id: string;
    fromToken: string;
    toToken: string;
    amount: bigint;
    rate: bigint;
    status: string;
    createdAt: bigint;
    updatedAt: bigint;
};

export default ExchangeCanister;