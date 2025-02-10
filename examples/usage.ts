import { GeckoTerminal } from "../src";
import util from "util";

const inspect = <T>(obj: T): string =>
    util.inspect(obj, {
        depth: 3,
        colors: true,
        maxArrayLength: 3,
    });

// Example of error handling
async function demonstrateErrorHandling(): Promise<void> {
    console.log("\n=== Error Handling Demonstration ===");
    const client = new GeckoTerminal();

    try {
        console.log("\nTesting invalid network handling...");
        await client.getNetworkDexes("invalid-network");
    } catch (error) {
        console.error(
            "Expected error for invalid network:",
            error instanceof Error ? error.message : String(error)
        );
    }

    try {
        console.log("\nTesting invalid token address handling...");
        await client.getTokenInfo("cfx", "invalid-address");
    } catch (error) {
        console.error(
            "Expected error for invalid token:",
            error instanceof Error ? error.message : String(error)
        );
    }

    console.log("\n=== End of Error Handling Demonstration ===\n");
    console.log("=".repeat(80), "\n");
}

async function demonstrateGeckoTerminalUsage(): Promise<void> {
    const client = new GeckoTerminal();

    try {
        console.log("=== Network Methods ===");

        // Get all networks
        console.log("\nFetching networks...");
        const networks = await client.getNetworks();
        console.log("Networks:", inspect(networks.data));

        // Get network DEXes for Conflux
        console.log("\nFetching DEXes for Conflux network...");
        const dexes = await client.getNetworkDexes("cfx");
        console.log("Conflux DEXes:", inspect(dexes.data));

        console.log("\n=== Pool Methods ===");

        // Get top pools for Swappi on Conflux
        console.log("\nFetching top pools for Swappi on Conflux...");
        const topPools = await client.getTopPools("cfx", "swappi");
        console.log("Top Pools:", inspect(topPools.data.slice(0, 3)));

        // Get trending pools
        console.log("\nFetching trending pools on Conflux...");
        const trendingPools = await client.getTrendingPools("cfx", "24h");
        console.log("Trending Pools:", inspect(trendingPools.data.slice(0, 3)));

        // Get new pools
        console.log("\nFetching new pools on Conflux...");
        const newPools = await client.getNewPools("cfx");
        console.log("New Pools:", inspect(newPools.data.slice(0, 3)));

        // Get specific pool info (using first pool from top pools)
        if (topPools.data.length > 0) {
            const poolAddress = topPools.data[0].attributes.address;
            console.log(`\nFetching info for pool: ${poolAddress}`);
            const poolInfo = await client.getPoolInfo("cfx", poolAddress);
            console.log("Pool Info:", inspect(poolInfo.data));

            // Get pool trades
            console.log(`\nFetching trades for pool: ${poolAddress}`);
            const trades = await client.getPoolTrades("cfx", poolAddress);
            console.log("Recent Trades:", inspect(trades.data.slice(0, 3)));

            // Get OHLCV data
            console.log(`\nFetching OHLCV data for pool: ${poolAddress}`);
            const ohlcv = await client.getPoolOHLCV("cfx", poolAddress, "hour", {
                limit: "3",
            });
            console.log("OHLCV Data:", inspect(ohlcv.data));

            // Get pool tokens info
            console.log(`\nFetching token info for pool: ${poolAddress}`);
            const poolTokensInfo = await client.getPoolTokensInfo("cfx", poolAddress);
            console.log("Pool Tokens Info:", inspect(poolTokensInfo.data));

            // Get base token info
            const baseTokenAddress = topPools.data[0].relationships.base_token.data.id;
            console.log(`\nFetching info for base token: ${baseTokenAddress}`);
            const tokenInfo = await client.getTokenInfo("cfx", baseTokenAddress);
            console.log("Token Info:", inspect(tokenInfo.data));

            // Get token pools
            console.log(`\nFetching pools for token: ${baseTokenAddress}`);
            const tokenPools = await client.getTokenPools("cfx", baseTokenAddress);
            console.log("Token Pools:", inspect(tokenPools.data.slice(0, 3)));

            // Get multiple token info
            const quoteTokenAddress = topPools.data[0].relationships.quote_token.data.id;
            console.log("\nFetching info for multiple tokens...");
            const multiTokenInfo = await client.getMultiTokenInfo("cfx", [
                baseTokenAddress,
                quoteTokenAddress,
            ]);
            console.log("Multi-Token Info:", inspect(multiTokenInfo.data));

            // Get simple token prices
            console.log("\nFetching simple token prices...");
            const tokenPrices = await client.getSimpleTokenPrices(
                "cfx",
                [baseTokenAddress, quoteTokenAddress],
                true,
                true
            );
            console.log("Token Prices:", inspect(tokenPrices.data));
        }

        console.log("\n=== Search Methods ===");

        // Search pools
        console.log("\nSearching for WETH pools...");
        const searchResults = await client.searchPools("WETH", "cfx");
        console.log("Search Results:", inspect(searchResults.data.slice(0, 3)));

    } catch (error) {
        console.error(
            "Error during demonstration:",
            error instanceof Error ? error.message : String(error)
        );
    }
}

// Run the demonstrations
if (require.main === module) {
    console.log("Starting GeckoTerminal API demonstrations...");
    demonstrateErrorHandling()
        .then(() => demonstrateGeckoTerminalUsage())
        .catch((error) =>
            console.error(
                "Error running demonstrations:",
                error instanceof Error ? error.message : String(error)
            )
        );
}

export { demonstrateErrorHandling, demonstrateGeckoTerminalUsage };
