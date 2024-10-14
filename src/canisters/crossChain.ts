// import {
//   query,
//   update,
//   StableBTreeMap
// } from 'azle';
// import { v4 as uuidv4 } from 'uuid';

// type CrossChainTransaction = {
//   id: string;
//   fromChain: string;
//   toChain: string;
//   fromAddress: string;
//   toAddress: string;
//   amount: bigint;
//   status: string;
//   signatures: string[];
//   createdAt: bigint;
//   updatedAt: bigint;
// };

// const transactionStorage = StableBTreeMap<string, CrossChainTransaction>(
//   0
// );

// const REQUIRED_SIGNATURES = 2;
// const VALIDATORS = [
//     'rrkah-fqaaa-aaaaa-aaaaq-cai',
//     'r7inp-6aaaa-aaaaa-aaabq-cai',
//     'rwlgt-iiaaa-aaaaa-aaaaa-cai'
// ];

// query;
// export function getTransaction(
//   id: string
// ): { Ok?: CrossChainTransaction; Err?: string } {
//   const tx = transactionStorage.get(id);
//   return tx ? { Ok: tx } : { Err: `Transaction with id=${id} not found` };
// }

// update;
// export function createTransaction(
//   fromChain: string,
//   toChain: string,
//   fromAddress: string,
//   toAddress: string,
//   amount: bigint
// ): { Ok?: CrossChainTransaction; Err?: string } {
//   const transaction: CrossChainTransaction = {
//     id: uuidv4(),
//     fromChain,
//     toChain,
//     fromAddress,
//     toAddress,
//     amount,
//     status: 'PENDING',
//     signatures: [],
//     createdAt: BigInt(Date.now()), // Replace `ic.time()` with `BigInt(Date.now())`
//     updatedAt: BigInt(Date.now()), // Replace `ic.time()` with `BigInt(Date.now())`
//   };
//   transactionStorage.insert(transaction.id, transaction);
//   return { Ok: transaction };
// }

// update;
// export function updateTransactionStatus(
//   id: string,
//   status: string
// ): { Ok?: CrossChainTransaction; Err?: string } {
//   const tx = transactionStorage.get(id);
//   if (!tx) {
//     return { Err: `Transaction with id=${id} not found` };
//   }

//   const updatedTx: CrossChainTransaction = {
//     ...tx,
//     status,
//     updatedAt: BigInt(Date.now()),
//   };
//   transactionStorage.insert(tx.id, updatedTx);
//   return { Ok: updatedTx };
// }

// update;
// export function signTransaction(id: string, signature: string): { Ok?: CrossChainTransaction; Err?: string } {
//     const tx = transactionStorage.get(id);
//     if (!tx) {
//         return { Err: `Transaction with id=${id} not found` };
//     }
//     if (tx.status !== 'PENDING') {
//         return { Err: `Transaction ${id} is not in PENDING state` };
//     }
    
//     const caller = 'rrkah-fqaaa-aaaaa-aaaaq-cai'; // Replace this with the correct caller fetch method
//     if (!VALIDATORS.includes(caller)) {
//         return { Err: `Caller ${caller} is not authorized to sign transactions` };
//     }
    
//     if (tx.signatures.includes(signature)) {
//         return { Err: `Signature already exists for transaction ${id}` };
//     }
    
//     const updatedSignatures = [...tx.signatures, signature];
//     const updatedStatus = updatedSignatures.length >= REQUIRED_SIGNATURES ? 'APPROVED' : 'PENDING';
    
//     const updatedTx: CrossChainTransaction = {
//         ...tx,
//         signatures: updatedSignatures,
//         status: updatedStatus,
//         updatedAt: BigInt(Date.now())
//     };
    
//     transactionStorage.insert(id, updatedTx);
//     return { Ok: updatedTx };
// }

//////////////////////////////////////////////////////////////////////

import { IDL, query, update, StableBTreeMap } from 'azle';
import { v4 as uuidv4 } from 'uuid';

const CrossChainTransactionIDL = IDL.Record({
    id: IDL.Text,
    fromChain: IDL.Text,
    toChain: IDL.Text,
    fromAddress: IDL.Text,
    toAddress: IDL.Text,
    amount: IDL.Nat64,
    status: IDL.Text,
    signatures: IDL.Vec(IDL.Text),
    createdAt: IDL.Nat64,
    updatedAt: IDL.Nat64
});

class CrossChainCanister {
    private transactionStorage = StableBTreeMap<string, CrossChainTransaction>(0);
    private readonly REQUIRED_SIGNATURES = 2;
    private readonly VALIDATORS = [
        'rrkah-fqaaa-aaaaa-aaaaq-cai',
        'r7inp-6aaaa-aaaaa-aaabq-cai',
        'rwlgt-iiaaa-aaaaa-aaaaa-cai'
    ];

    @query([IDL.Text], IDL.Variant({ Ok: CrossChainTransactionIDL, Err: IDL.Text }))
    getTransaction(id: string): { Ok?: CrossChainTransaction; Err?: string } {
        const tx = this.transactionStorage.get(id);
        return tx ? { Ok: tx } : { Err: `Transaction with id=${id} not found` };
    }

    @update([IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Nat64], IDL.Variant({ Ok: CrossChainTransactionIDL, Err: IDL.Text }))
    createTransaction(
        fromChain: string,
        toChain: string,
        fromAddress: string,
        toAddress: string,
        amount: bigint
    ): { Ok?: CrossChainTransaction; Err?: string } {
        const transaction: CrossChainTransaction = {
            id: uuidv4(),
            fromChain,
            toChain,
            fromAddress,
            toAddress,
            amount,
            status: 'PENDING',
            signatures: [],
            createdAt: BigInt(Date.now()),
            updatedAt: BigInt(Date.now()),
        };
        this.transactionStorage.insert(transaction.id, transaction);
        return { Ok: transaction };
    }

    @update([IDL.Text, IDL.Text], IDL.Variant({ Ok: CrossChainTransactionIDL, Err: IDL.Text }))
    updateTransactionStatus(
        id: string,
        status: string
    ): { Ok?: CrossChainTransaction; Err?: string } {
        const tx = this.transactionStorage.get(id);
        if (!tx) {
            return { Err: `Transaction with id=${id} not found` };
        }

        const updatedTx: CrossChainTransaction = {
            ...tx,
            status,
            updatedAt: BigInt(Date.now()),
        };
        this.transactionStorage.insert(tx.id, updatedTx);
        return { Ok: updatedTx };
    }

    @update([IDL.Text, IDL.Text], IDL.Variant({ Ok: CrossChainTransactionIDL, Err: IDL.Text }))
    signTransaction(id: string, signature: string): { Ok?: CrossChainTransaction; Err?: string } {
        const tx = this.transactionStorage.get(id);
        if (!tx) {
            return { Err: `Transaction with id=${id} not found` };
        }
        if (tx.status !== 'PENDING') {
            return { Err: `Transaction ${id} is not in PENDING state` };
        }
        
        const caller = 'rrkah-fqaaa-aaaaa-aaaaq-cai'; // Replace this with the correct caller fetch method
        if (!this.VALIDATORS.includes(caller)) {
            return { Err: `Caller ${caller} is not authorized to sign transactions` };
        }
        
        if (tx.signatures.includes(signature)) {
            return { Err: `Signature already exists for transaction ${id}` };
        }
        
        const updatedSignatures = [...tx.signatures, signature];
        const updatedStatus = updatedSignatures.length >= this.REQUIRED_SIGNATURES ? 'APPROVED' : 'PENDING';
        
        const updatedTx: CrossChainTransaction = {
            ...tx,
            signatures: updatedSignatures,
            status: updatedStatus,
            updatedAt: BigInt(Date.now())
        };
        
        this.transactionStorage.insert(id, updatedTx);
        return { Ok: updatedTx };
    }
}

type CrossChainTransaction = {
    id: string;
    fromChain: string;
    toChain: string;
    fromAddress: string;
    toAddress: string;
    amount: bigint;
    status: string;
    signatures: string[];
    createdAt: bigint;
    updatedAt: bigint;
};

export default CrossChainCanister;