export const idlFactory = ({ IDL }) => {
  const Wallet = IDL.Record({
      'id': IDL.Text,
      'owner': IDL.Text,
      'balance': IDL.Nat64,  // Keep IDL.Nat64 for big integers
      'createdAt': IDL.Nat64,
      'updatedAt': IDL.Nat64,
  });

  return IDL.Service({
      'getWallet': IDL.Func([IDL.Text], [IDL.Variant({ 'Ok': Wallet, 'Err': IDL.Text })], ['query']),
      'createWallet': IDL.Func([IDL.Text], [IDL.Variant({ 'Ok': Wallet, 'Err': IDL.Text })], []),
      'updateWalletBalance': IDL.Func([IDL.Text, IDL.Nat64], [IDL.Variant({ 'Ok': Wallet, 'Err': IDL.Text })], []),
  });
};
