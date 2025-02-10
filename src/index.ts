/**
 * GeckoTerminal API Client
 * @packageDocumentation
 */

// Core exports
export { GeckoTerminal, GeckoTerminalAPI } from "./core";

// Export all types that are referenced in the public API
export type {
    // Response types
    PoolsResponse,
    TokenInfo,
    MultiTokenResponse,
    MultiPoolResponse,
    OHLCVResponse,
    NetworkDexesResponse,
    NetworksResponse,
    TrendingPoolsResponse,
    SimpleTokenPriceResponse,
    // Base types
    Pool,
    Token,
} from "./types/responses";
