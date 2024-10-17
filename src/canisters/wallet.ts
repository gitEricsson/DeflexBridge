import { IDL, query, update, StableBTreeMap } from 'azle';
import { v4 as uuidv4 } from 'uuid';

const WalletIDL = IDL.Record({
    id: IDL.Text,
    owner: IDL.Text,
    balance: IDL.Nat64,
    createdAt: IDL.Nat64,
    updatedAt: IDL.Nat64
});

class WalletCanister {
    private walletStorage = StableBTreeMap<string, Wallet>(0);
    private ownerStorage = StableBTreeMap<string, string>(1); // Maps owner to wallet ID

    @query([IDL.Text], IDL.Variant({ Ok: WalletIDL, Err: IDL.Text }))
    getWallet(id: string): { Ok?: Wallet; Err?: string } {
        const wallet = this.walletStorage.get(id);
        return wallet
            ? { Ok: wallet }
            : { Err: `Wallet with id=${id} not found` };
    }

    @query([IDL.Text], IDL.Variant({ Ok: WalletIDL, Err: IDL.Text }))
    getWalletByOwner(owner: string): { Ok?: Wallet; Err?: string } {
        const walletId = this.ownerStorage.get(owner);
        if (!walletId) {
            return { Err: `No wallet found for owner ${owner}` };
        }
        const wallet = this.walletStorage.get(walletId);
        return wallet
            ? { Ok: wallet }
            : { Err: `Wallet with id=${walletId} not found` };
    }

    @update([IDL.Text], IDL.Variant({ Ok: WalletIDL, Err: IDL.Text }))
    createWallet(owner: string): { Ok?: Wallet; Err?: string } {
        const existingWalletId = this.ownerStorage.get(owner);
        if (existingWalletId) {
            return { Err: `Wallet for owner ${owner} already exists.` };
        }

        const wallet: Wallet = {
            id: uuidv4(),
            owner,
            balance: 0n,
            createdAt: BigInt(Date.now()),
            updatedAt: BigInt(Date.now()),
        };
        this.walletStorage.insert(wallet.id, wallet);
        this.ownerStorage.insert(owner, wallet.id);
        return { Ok: wallet };
    }

    @update([IDL.Text], IDL.Variant({ Ok: WalletIDL, Err: IDL.Text }))
    deleteWallet(id: string): { Ok?: string; Err?: string } {
        const wallet = this.walletStorage.get(id);
        if (!wallet) {
            return { Err: `Wallet with id=${id} not found` };
        }

        this.walletStorage.remove(id);
        this.ownerStorage.remove(wallet.owner);
        return { Ok: `Wallet with id=${id} has been deleted.` };
    }

    @update([IDL.Text, IDL.Nat64], IDL.Variant({ Ok: WalletIDL, Err: IDL.Text }))
    updateWalletBalance(
        id: string,
        amount: bigint
    ): { Ok?: Wallet; Err?: string } {
        const wallet = this.walletStorage.get(id);
        if (!wallet) {
            return { Err: `Wallet with id=${id} not found` };
        }

        const updatedWallet: Wallet = {
            ...wallet,
            balance: wallet.balance + amount,
            updatedAt: BigInt(Date.now()),
        };
        this.walletStorage.insert(wallet.id, updatedWallet);
        return { Ok: updatedWallet };
    }
}

type Wallet = {
    id: string;
    owner: string;
    balance: bigint;
    createdAt: bigint;
    updatedAt: bigint;
};

export default WalletCanister;