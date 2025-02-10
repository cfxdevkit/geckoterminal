import { GeckoTerminal } from "../src";
import util from "util";
import { createLogger } from "../src/utils/logger";

const logger = createLogger("Example");

const inspect = <T>(obj: T): string =>
  util.inspect(obj, {
    depth: 5,
    colors: true,
    maxArrayLength: 3,
  });

async function NetworkEndpoints(client: GeckoTerminal): Promise<void> {
  console.log("=== ing Network Endpoints ===");

  // Get all networks
  console.log("Getting all networks");
  const networks = await client.getNetworks();
  console.log("\nNetworks:", inspect(networks));

  // Get network DEXes
  console.log("Getting DEXes for Conflux network");
  const dexes = await client.getNetworkDexes("cfx");
  console.log("\nDEXes for Conflux:", inspect(dexes));
}

async function PoolEndpoints(client: GeckoTerminal): Promise<void> {
  console.log("=== ing Pool Endpoints ===");

  // Get top pools
  console.log("Getting top pools for Swappi on Conflux");
  const topPools = await client.getTopPools("cfx", "swappi");
  console.log("\nTop Pools:", inspect(topPools));

  // Get trending pools
  console.log("Getting trending pools on Conflux");
  const trendingPools = await client.getTrendingPools("cfx", "24h");
  console.log("\nTrending Pools:", inspect(trendingPools));

  // Get new pools
  console.log("Getting new pools on Conflux");
  const newPools = await client.getNewPools("cfx");
  console.log("\nNew Pools:", inspect(newPools));

  if (topPools.data && topPools.data.length > 0) {
    const pool = topPools.data[0];
    const poolAddress = pool.attributes.address;
    const cleanPoolAddress = poolAddress.replace("cfx_", "");

    // Get pool info
    console.log(`Getting info for pool: ${cleanPoolAddress}`);
    const poolInfo = await client.getPoolInfo("cfx", cleanPoolAddress);
    console.log("\nPool Info:", inspect(poolInfo));

    // Get pool trades
    console.log(`Getting trades for pool: ${cleanPoolAddress}`);
    const trades = await client.getPoolTrades("cfx", cleanPoolAddress);
    console.log("\nPool Trades:", inspect(trades));

    // Get pool OHLCV data
    console.log(`Getting OHLCV data for pool: ${cleanPoolAddress}`);
    const ohlcv = await client.getPoolOHLCV("cfx", cleanPoolAddress, "hour", {
      limit: "3",
    });
    console.log("\nPool OHLCV:", inspect(ohlcv));

    // Get pool tokens info
    console.log(`Getting token info for pool: ${cleanPoolAddress}`);
    const poolTokens = await client.getPoolTokensInfo("cfx", cleanPoolAddress);
    console.log("\nPool Tokens:", inspect(poolTokens));

    // Get multiple pool info
    if (topPools.data.length >= 2) {
      const poolAddresses = topPools.data
        .slice(0, 2)
        .map((p) => p.attributes.address.replace("cfx_", ""));
      console.log(`Getting info for multiple pools: ${poolAddresses.join(", ")}`);
      const multiPoolInfo = await client.getMultiPoolInfo("cfx", poolAddresses);
      console.log("\nMultiple Pool Info:", inspect(multiPoolInfo));
    }
  }
}

async function TokenEndpoints(client: GeckoTerminal): Promise<void> {
  console.log("=== ing Token Endpoints ===");

  // First get a pool to get token addresses
  const topPools = await client.getTopPools("cfx", "swappi");

  if (topPools.data && topPools.data.length > 0) {
    const pool = topPools.data[0];
    const baseTokenId = pool.relationships.base_token.data.id.replace("cfx_", "");
    const quoteTokenId = pool.relationships.quote_token.data.id.replace("cfx_", "");

    // Get token info
    console.log(`Getting info for token: ${baseTokenId}`);
    const tokenInfo = await client.getTokenInfo("cfx", baseTokenId);
    console.log("\nToken Info:", inspect(tokenInfo));

    // Get token pools
    console.log(`Getting pools for token: ${baseTokenId}`);
    const tokenPools = await client.getTokenPools("cfx", baseTokenId);
    console.log("\nToken Pools:", inspect(tokenPools));

    // Get multiple token info
    console.log("Getting info for multiple tokens");
    const multiTokenInfo = await client.getMultiTokenInfo("cfx", [baseTokenId, quoteTokenId]);
    console.log("\nMultiple Token Info:", inspect(multiTokenInfo));

    // Get simple token prices
    console.log("Getting simple token prices");
    const tokenPrices = await client.getSimpleTokenPrices(
      "cfx",
      [baseTokenId, quoteTokenId],
      true,
      true
    );
    console.log("\nToken Prices:", inspect(tokenPrices));
  }
}

async function SearchEndpoints(client: GeckoTerminal): Promise<void> {
  console.log("=== ing Search Endpoints ===");

  // Search for WETH pools
  console.log("Searching for WETH pools");
  const searchResults = await client.searchPools("ETH", "cfx");
  console.log("\nSearch Results:", inspect(searchResults));
}

async function runAlls(): Promise<void> {
  console.log("Starting GeckoTerminal API s");
  const client = new GeckoTerminal();

  try {
    //  network endpoints
    await NetworkEndpoints(client);

    //  pool endpoints
    await PoolEndpoints(client);

    //  token endpoints
    await TokenEndpoints(client);

    //  search endpoints
    await SearchEndpoints(client);
  } catch (error) {
    logger.error("Error during s", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}

// Run the s
if (require.main === module) {
  console.log("Starting GeckoTerminal API s...\n");
  runAlls()
    .then(() => console.log("\nAll examples completed successfully"))
    .catch((error) => {
      console.error("\ns failed:", error instanceof Error ? error.message : String(error));
      process.exit(1);
    });
}

export { runAlls };
