import { createLogger } from "../utils/logger";
import { GeckoTerminalAPI } from "./api";
import type {
    PoolsResponse,
    TokenInfo,
    MultiTokenResponse,
    MultiPoolResponse,
    OHLCVResponse,
    NetworkDexesResponse,
    NetworksResponse,
    TrendingPoolsResponse,
    SimpleTokenPriceResponse,
    TradesResponse,
    TokenInfoMetadataResponse,
} from "../types/responses";

const logger = createLogger("GeckoTerminal");

/**
 * GeckoTerminal API client
 * Provides methods to interact with GeckoTerminal's API endpoints
 * @public
 */
export class GeckoTerminal extends GeckoTerminalAPI {
    /**
     * Get all networks supported by GeckoTerminal
     * @param page - Page number for pagination
     * @returns Promise with array of networks
     */
    async getNetworks(page = 1): Promise<NetworksResponse> {
        logger.debug("Getting networks list");
        return this.fetchApi<NetworksResponse>("/networks", { page: String(page) });
    }

    /**
     * Get all DEXes for a specific network
     * @param network - Network identifier (defaults to constructor network)
     * @param page - Page number for pagination
     * @returns Promise with array of DEXes
     */
    async getNetworkDexes(network: string = this.network, page = 1): Promise<NetworkDexesResponse> {
        logger.debug(`Getting DEXes for network: ${network}`);
        return this.fetchApi<NetworkDexesResponse>(`/networks/${network}/dexes`, {
            page: String(page),
        });
    }

    /**
     * Get top pools for a specific network and DEX
     * @param network - Network identifier (defaults to constructor network)
     * @param dex - DEX identifier (defaults to DEFAULT_DEX)
     * @param page - Page number for pagination
     * @returns Promise with array of pools
     */
    async getTopPools(
        network: string = this.network,
        dex: string = this.DEFAULT_DEX,
        page = 1
    ): Promise<PoolsResponse> {
        logger.debug(`Getting top pools for network: ${network}, dex: ${dex}`);
        return this.fetchApi<PoolsResponse>(`/networks/${network}/dexes/${dex}/pools`, {
            page: String(page),
        });
    }

    /**
     * Get trending pools for a specific network
     * @param network - Network identifier (defaults to constructor network)
     * @param duration - Time duration for trending calculation
     * @param page - Page number for pagination
     * @returns Promise with array of trending pools
     */
    async getTrendingPools(
        network: string = this.network,
        duration: "5m" | "1h" | "6h" | "24h" = "24h",
        page = 1
    ): Promise<TrendingPoolsResponse> {
        logger.debug(`Getting trending pools for network: ${network}`);
        return this.fetchApi<TrendingPoolsResponse>(`/networks/${network}/trending_pools`, {
            duration,
            page: String(page),
        });
    }

    /**
     * Get new pools for a specific network
     * @param network - Network identifier (defaults to constructor network)
     * @param page - Page number for pagination
     * @returns Promise with array of new pools
     */
    async getNewPools(network: string = this.network, page = 1): Promise<PoolsResponse> {
        logger.debug(`Getting new pools for network: ${network}`);
        return this.fetchApi<PoolsResponse>(`/networks/${network}/new_pools`, {
            page: String(page),
        });
    }

    /**
     * Get information about a specific pool
     * @param network - Network identifier (defaults to constructor network)
     * @param poolAddress - Address of the pool
     * @returns Promise with pool information
     */
    async getPoolInfo(
        network: string = this.network,
        poolAddress: string
    ): Promise<MultiPoolResponse> {
        logger.debug(`Getting pool info for: ${poolAddress}`);
        return this.fetchApi<MultiPoolResponse>(`/networks/${network}/pools/${poolAddress}`);
    }

    /**
     * Get trades for a specific pool
     * @param network - Network identifier (defaults to constructor network)
     * @param poolAddress - Address of the pool
     * @param minVolumeUsd - Minimum trade volume in USD
     * @returns Promise with pool trades
     */
    async getPoolTrades(
        network: string = this.network,
        poolAddress: string,
        minVolumeUsd?: number
    ): Promise<TradesResponse> {
        logger.debug(`Getting trades for pool: ${poolAddress}`);
        const params: Record<string, string> = {};
        if (minVolumeUsd) {
            params.trade_volume_in_usd_greater_than = String(minVolumeUsd);
        }
        return this.fetchApi<TradesResponse>(`/networks/${network}/pools/${poolAddress}/trades`, params);
    }

    /**
     * Get token info for pool tokens
     * @param network - Network identifier (defaults to constructor network)
     * @param poolAddress - Address of the pool
     * @returns Promise with pool tokens info
     */
    async getPoolTokensInfo(
        network: string = this.network,
        poolAddress: string
    ): Promise<TokenInfoMetadataResponse> {
        logger.debug(`Getting token info for pool: ${poolAddress}`);
        return this.fetchApi<TokenInfoMetadataResponse>(`/networks/${network}/pools/${poolAddress}/info`);
    }

    /**
     * Get information about multiple pools
     * @param network - Network identifier (defaults to constructor network)
     * @param poolAddresses - Array of pool addresses
     * @returns Promise with information about multiple pools
     */
    async getMultiPoolInfo(
        network: string = this.network,
        poolAddresses: string[]
    ): Promise<MultiPoolResponse> {
        logger.debug(`Getting info for multiple pools: ${poolAddresses.join(", ")}`);
        return this.fetchApi<MultiPoolResponse>(
            `/networks/${network}/pools/multi/${poolAddresses.join(",")}`
        );
    }

    /**
     * Get information about a specific token
     * @param network - Network identifier (defaults to constructor network)
     * @param tokenAddress - Address of the token
     * @returns Promise with token information
     */
    async getTokenInfo(network: string = this.network, tokenAddress: string): Promise<TokenInfo> {
        logger.debug(`Getting token info for: ${tokenAddress}`);
        return this.fetchApi<TokenInfo>(`/networks/${network}/tokens/${tokenAddress}`);
    }

    /**
     * Get pools for a specific token
     * @param network - Network identifier (defaults to constructor network)
     * @param tokenAddress - Address of the token
     * @param page - Page number for pagination
     * @returns Promise with token pools
     */
    async getTokenPools(
        network: string = this.network,
        tokenAddress: string,
        page = 1
    ): Promise<PoolsResponse> {
        logger.debug(`Getting pools for token: ${tokenAddress}`);
        return this.fetchApi<PoolsResponse>(`/networks/${network}/tokens/${tokenAddress}/pools`, {
            page: String(page),
        });
    }

    /**
     * Get information about multiple tokens
     * @param network - Network identifier (defaults to constructor network)
     * @param tokenAddresses - Array of token addresses (max 30)
     * @returns Promise with information about multiple tokens
     */
    async getMultiTokenInfo(
        network: string = this.network,
        tokenAddresses: string[]
    ): Promise<MultiTokenResponse> {
        logger.debug(`Getting info for multiple tokens: ${tokenAddresses.join(", ")}`);
        if (tokenAddresses.length > 30) {
            throw new Error("Maximum of 30 token addresses allowed per request");
        }
        return this.fetchApi<MultiTokenResponse>(
            `/networks/${network}/tokens/multi/${tokenAddresses.join(",")}`
        );
    }

    /**
     * Get OHLCV data for a specific pool
     * @param network - Network identifier (defaults to constructor network)
     * @param poolAddress - Address of the pool
     * @param timeframe - Timeframe for OHLCV data
     * @param params - Additional parameters for the request
     * @returns Promise with OHLCV data
     */
    async getPoolOHLCV(
        network: string = this.network,
        poolAddress: string,
        timeframe: "minute" | "hour" | "day",
        params: {
            aggregate?: string;
            before_timestamp?: string;
            limit?: string;
            currency?: "usd" | "token";
            token?: "base" | "quote" | string;
        } = {}
    ): Promise<OHLCVResponse> {
        logger.debug(`Getting OHLCV data for pool: ${poolAddress}`);
        return this.fetchApi<OHLCVResponse>(
            `/networks/${network}/pools/${poolAddress}/ohlcv/${timeframe}`,
            params
        );
    }

    /**
     * Get simple token prices
     * @param network - Network identifier (defaults to constructor network)
     * @param addresses - Array of token addresses (max 30)
     * @param include_24hr_vol - Whether to include 24h volume
     * @param include_market_cap - Whether to include market cap
     * @returns Promise with token prices
     */
    async getSimpleTokenPrices(
        network: string = this.network,
        addresses: string[],
        include_24hr_vol = false,
        include_market_cap = false
    ): Promise<SimpleTokenPriceResponse> {
        logger.debug(`Getting simple token prices for: ${addresses.join(", ")}`);
        if (addresses.length > 30) {
            throw new Error("Maximum of 30 addresses allowed per request");
        }
        return this.fetchApi<SimpleTokenPriceResponse>(
            `/simple/networks/${network}/token_price/${addresses.join(",")}`,
            {
                include_24hr_vol: String(include_24hr_vol),
                include_market_cap: String(include_market_cap),
            }
        );
    }

    /**
     * Search for pools
     * @param query - Search query (pool address, token address, or token symbol)
     * @param network - Network identifier (optional)
     * @param page - Page number for pagination
     * @returns Promise with search results
     */
    async searchPools(
        query: string,
        network?: string,
        page = 1
    ): Promise<PoolsResponse> {
        logger.debug(`Searching pools with query: ${query}`);
        const params: Record<string, string> = {
            query,
            page: String(page),
        };
        if (network) {
            params.network = network;
        }
        return this.fetchApi<PoolsResponse>("/search/pools", params);
    }
} 