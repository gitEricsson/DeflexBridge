export interface Wallet {
  id: string;
  owner: string;
  balance: bigint;
  createdAt: bigint;
  updatedAt: bigint;
}

export interface CrossChainTransaction {
  id: string;
  fromChain: string;
  toChain: string;
  fromAddress: string;
  toAddress: string;
  amount: bigint;
  status: string;
  createdAt: bigint;
  updatedAt: bigint;
}

export interface Exchange {
  id: string;
  fromToken: string;
  toToken: string;
  amount: bigint;
  rate: bigint;
  status: string;
  createdAt: bigint;
  updatedAt: bigint;
}
