/**
 * GeckoTerminal API Client
 * @packageDocumentation
 *
 * This module provides a TypeScript client for interacting with the GeckoTerminal API.
 * It includes comprehensive type definitions and utilities for working with DEX data.
 */

// Core exports
export { GeckoTerminal } from "./core/geckoterminal";
export { GeckoTerminalAPI } from "./core/api";

// Export all response types
export type {
  // Base types
  BaseAttributes,

  // Core entity types
  Token,
  Pool,
  Network,
  NetworkDex,
  Trade,

  // Response types
  PoolsResponse,
  TokenInfo,
  TokenInfoMetadataResponse,
  MultiTokenResponse,
  MultiPoolResponse,
  OHLCVResponse,
  OHLCVDataPoint,
  NetworkDexesResponse,
  NetworksResponse,
  TrendingPoolsResponse,
  SimpleTokenPriceResponse,
  TradesResponse,

  // Formatted types
  FormattedNetwork,
  FormattedDex,
  FormattedOHLCV,
  FormattedTokenPrice,
  FormattedPool,
} from "./types/responses";

// Export formatters
export { formatUtils } from "./formatters";
