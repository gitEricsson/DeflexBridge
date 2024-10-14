import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });


const canisterIds = {
    crossChain: process.env.CROSSCHAIN_ID,   // Replace with actual cross-chain canister ID
    liquidityPool: process.env.LIQUIDITY_POOL_ID, // Replace with actual liquidity pool canister ID
    wallet: process.env.WALLET_ID  // Replace with actual wallet canister ID
    // Add other canisters as needed
};
  
export function getCanisterId(canisterName: string): string {
    const id = canisterIds[canisterName];
    if (!id) {
        throw new Error(`Canister ID not found for ${canisterName}`);
    }
    return id;
}
