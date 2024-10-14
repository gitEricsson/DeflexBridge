export async function makeHttpOutcall(url: string, method: string, body?: any) {
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  const responseData = await response.json();
  return responseData;
}
