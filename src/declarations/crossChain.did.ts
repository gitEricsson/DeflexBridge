export const idlFactory = ({ IDL }) => {
  const CrossChainTransaction = IDL.Record({
      'id': IDL.Text,
      'fromChain': IDL.Text,
      'toChain': IDL.Text,
      'fromAddress': IDL.Text,
      'toAddress': IDL.Text,
      'amount': IDL.Nat64,  // This remains IDL.Nat64 for big integer representation in Candid
      'status': IDL.Text,
      'signatures': IDL.Vec(IDL.Text),
      'createdAt': IDL.Nat64,
      'updatedAt': IDL.Nat64,
  });

  return IDL.Service({
      'getTransaction': IDL.Func([IDL.Text], [IDL.Variant({ 'Ok': CrossChainTransaction, 'Err': IDL.Text })], ['query']),
      'createTransaction': IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Nat64], [IDL.Variant({ 'Ok': CrossChainTransaction, 'Err': IDL.Text })], []),
      'signTransaction': IDL.Func([IDL.Text, IDL.Text], [IDL.Variant({ 'Ok': CrossChainTransaction, 'Err': IDL.Text })], []),
      'executeTransaction': IDL.Func([IDL.Text], [IDL.Variant({ 'Ok': CrossChainTransaction, 'Err': IDL.Text })], []),
  });
};
