import { makeHttpOutcall } from './httpOutcalls';

const ZERO_EX_API_URL = 'https://api.0x.org';

export async function getQuote(
  sellToken: string,
  buyToken: string,
  sellAmount: string
) {
  const url = `${ZERO_EX_API_URL}/swap/v1/quote?sellToken=${sellToken}&buyToken=${buyToken}&sellAmount=${sellAmount}`;
  return makeHttpOutcall(url, 'GET');
}

export async function executeSwap(quote: any) {
  const url = `${ZERO_EX_API_URL}/swap/v1/fill`;
  return makeHttpOutcall(url, 'POST', quote);
}
