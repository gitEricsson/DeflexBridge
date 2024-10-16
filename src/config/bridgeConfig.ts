export const bridgeConfig = {
    ethereum: {
        bridgeContractAddress: '0x123EthereumBridgeAddress',
        rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID',
    },
    bsc: {
        bridgeContractAddress: '0x456BSCBridgeAddress',
        rpcUrl: 'https://bsc-dataseed.binance.org/',
    },
    polygon: {
        bridgeContractAddress: '0x789PolygonBridgeAddress',
        rpcUrl: 'https://polygon-rpc.com/',
    },
    avalanche: {
        bridgeContractAddress: '0xabcAvalancheBridgeAddress',
        rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    },
    fantom: {
        bridgeContractAddress: '0xdefFantomBridgeAddress',
        rpcUrl: 'https://rpcapi.fantom.network',
    },
    optimism: {
        bridgeContractAddress: '0xghiOptimismBridgeAddress',
        rpcUrl: 'https://mainnet.optimism.io',
    },
    arbitrum: {
        bridgeContractAddress: '0xjklArbitrumBridgeAddress',
        rpcUrl: 'https://arb1.arbitrum.io/rpc',
    },
    solana: {
        bridgeContractAddress: 'SolanaBridgeProgramAddress', 
        rpcUrl: 'https://api.mainnet-beta.solana.com',
    }
};
