import { IDL } from "@dfinity/candid";

export const idlFactory: IDL.InterfaceFactory = ({ IDL }) => {
  const Exchange = IDL.Record({
    'id': IDL.Text,
    'fromToken': IDL.Text,
    'toToken': IDL.Text,
    'amount': IDL.Nat64,
    'rate': IDL.Nat64,
    'status': IDL.Text,
    'createdAt': IDL.Nat64,
    'updatedAt': IDL.Nat64,
  });

  return IDL.Service({
    'getExchange': IDL.Func([IDL.Text], [IDL.Variant({ 'Ok': Exchange, 'Err': IDL.Text })], ['query']),
    'createExchange': IDL.Func([IDL.Text, IDL.Text, IDL.Nat64, IDL.Nat64], [IDL.Variant({ 'Ok': Exchange, 'Err': IDL.Text })], []),
    'updateExchangeStatus': IDL.Func([IDL.Text, IDL.Text], [IDL.Variant({ 'Ok': Exchange, 'Err': IDL.Text })], []),
  });
};