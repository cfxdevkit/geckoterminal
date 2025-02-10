/**
 * Base interface for API response attributes
 * @public
 */
export interface BaseAttributes {
  /** Unique identifier for the entity */
  id: string;
  /** Type of the entity */
  type: string;
}

/**
 * Token interface representing a cryptocurrency token
 * @public
 */
export interface Token extends BaseAttributes {
  attributes: {
    /** Token contract address */
    address: string;
    /** Token name */
    name: string;
    /** Token symbol */
    symbol: string;
    /** Number of decimal places */
    decimals: number;
    /** Current price in USD */
    price_usd: string | null;
    /** Total supply of the token */
    total_supply: string | null;
  };
}

/**
 * Pool interface representing a DEX trading pool
 * @public
 */
export interface Pool extends BaseAttributes {
  attributes: {
    /** Pool contract address */
    address: string;
    /** Pool name (typically BASE/QUOTE) */
    name: string;
    /** Pool creation timestamp */
    pool_created_at: string;
    /** Total reserve value in USD */
    reserve_in_usd: string;
    /** Base token price in USD */
    base_token_price_usd: string;
    /** Quote token price in USD */
    quote_token_price_usd: string;
    /** Base token price in native currency */
    base_token_price_native: string;
    /** Quote token price in native currency */
    quote_token_price_native: string;
    /** Native currency for base token price */
    base_token_price_native_currency: string;
    /** Volume data for different time periods */
    volume_usd: {
      h24: string;
      h6: string;
      m5: string;
    };
    /** Price change percentages for different time periods */
    price_change_percentage: {
      h24: string;
      h6: string;
      m5: string;
    };
    /** Transaction counts for different time periods */
    transactions: {
      h24: {
        buys: number;
        sells: number;
      };
      h6: {
        buys: number;
        sells: number;
      };
      m5: {
        buys: number;
        sells: number;
      };
    };
  };
  relationships: {
    base_token: {
      data: BaseAttributes;
    };
    quote_token: {
      data: BaseAttributes;
    };
    dex: {
      data: BaseAttributes;
    };
  };
}

/**
 * Network interface representing a blockchain network
 * @public
 */
export interface Network extends BaseAttributes {
  attributes: {
    /** Network name */
    name: string;
    /** Network identifier */
    identifier: string;
    /** Network description */
    description: string | null;
    /** URL to network logo */
    logo_url: string | null;
    /** Whether this is a mainnet */
    is_mainnet: boolean;
  };
}

/**
 * DEX interface representing a decentralized exchange
 * @public
 */
export interface NetworkDex extends BaseAttributes {
  attributes: {
    /** DEX name */
    name: string;
    /** DEX identifier */
    identifier: string;
    /** DEX description */
    description: string | null;
    /** URL to DEX logo */
    logo_url: string | null;
    /** DEX website URL */
    website: string | null;
  };
}

/**
 * OHLCV data point interface for candlestick data
 * @public
 */
export interface OHLCVDataPoint {
  /** Timestamp of the data point */
  datetime: string;
  /** Opening price */
  open: string;
  /** Highest price */
  high: string;
  /** Lowest price */
  low: string;
  /** Closing price */
  close: string;
  /** Trading volume */
  volume: string;
}

/**
 * Trade interface representing a single trade
 * @public
 */
export interface Trade extends BaseAttributes {
  attributes: {
    /** Block number of the trade */
    block_number: number;
    /** Block timestamp */
    block_timestamp: string;
    /** Transaction hash */
    tx_hash: string;
    /** Sender address */
    tx_from_address: string;
    /** Amount of tokens sent */
    from_token_amount: string;
    /** Amount of tokens received */
    to_token_amount: string;
    /** Price of sent token in currency token */
    price_from_in_currency_token: string;
    /** Price of received token in currency token */
    price_to_in_currency_token: string;
    /** Price of sent token in USD */
    price_from_in_usd: string;
    /** Price of received token in USD */
    price_to_in_usd: string;
    /** Type of trade */
    kind: string;
    /** Trade volume in USD */
    volume_in_usd: string;
    /** Address of sent token */
    from_token_address: string;
    /** Address of received token */
    to_token_address: string;
  };
}

/**
 * Response interface for pools endpoints
 * @public
 */
export interface PoolsResponse {
  data: Pool[];
  links: {
    first: string;
    last: string;
    next: string | null;
    prev: string | null;
  };
  meta: {
    total_pages: number;
    total_records: number;
  };
}

/**
 * Token info interface with additional metadata
 * @public
 */
export interface TokenInfoMetadataResponse {
  data: {
    id: string;
    type: string;
    attributes: {
      /** Token name */
      name: string;
      /** Token address */
      address: string;
      /** Token symbol */
      symbol: string;
      /** Number of decimal places */
      decimals: number;
      /** CoinGecko coin ID */
      coingecko_coin_id: string | null;
      /** Token logo URL */
      image_url: string | null;
      /** Token website URLs */
      websites: string[];
      /** Token description */
      description: string | null;
      /** Discord URL */
      discord_url: string | null;
      /** Telegram handle */
      telegram_handle: string | null;
      /** Twitter handle */
      twitter_handle: string | null;
      /** Token categories */
      categories: string[] | null;
      /** GeckoTerminal category IDs */
      gt_category_ids: string[] | null;
      /** GeckoTerminal score */
      gt_score: number | null;
      /** Last metadata update timestamp */
      metadata_updated_at: string | null;
    };
  }[];
}

/**
 * Response interface for token info
 * @public
 */
export interface TokenInfo {
  data: Token;
  included?: Token[];
}

/**
 * Response interface for multiple tokens
 * @public
 */
export interface MultiTokenResponse {
  data: Token[];
}

/**
 * Response interface for multiple pools
 * @public
 */
export interface MultiPoolResponse {
  data: Pool[];
}

/**
 * Response interface for OHLCV data
 * @public
 */
export interface OHLCVResponse {
  data: {
    id: string;
    type: string;
    attributes: OHLCVDataPoint[];
  };
}

/**
 * Response interface for network DEXes
 * @public
 */
export interface NetworkDexesResponse {
  data: NetworkDex[];
  links: {
    first: string;
    last: string;
    next: string | null;
    prev: string | null;
  };
}

/**
 * Response interface for networks
 * @public
 */
export interface NetworksResponse {
  data: Network[];
  links: {
    first: string;
    last: string;
    next: string | null;
    prev: string | null;
  };
}

/**
 * Response interface for trades
 * @public
 */
export interface TradesResponse {
  data: Trade[];
}

/**
 * Response interface for trending pools
 * Extends PoolsResponse with additional metadata about trending status
 *
 * @remarks
 * This interface uses the same structure as PoolsResponse but specifically for trending pools.
 * The pools returned will be ordered by their trending score based on volume and transaction metrics.
 *
 * @example
 * ```typescript
 * const trending = await client.getTrendingPools('cfx', '24h');
 * const trendingPools = trending.data.map(pool => ({
 *   name: pool.attributes.name,
 *   volume24h: pool.attributes.volume_usd.h24,
 *   transactions24h: pool.attributes.transactions.h24
 * }));
 * ```
 *
 * @public
 */
export interface TrendingPoolsResponse {
  /** Array of trending pool data */
  data: Pool[];
  /** Pagination links */
  links: {
    /** URL for the first page */
    first: string;
    /** URL for the last page */
    last: string;
    /** URL for the next page, null if on last page */
    next: string | null;
    /** URL for the previous page, null if on first page */
    prev: string | null;
  };
  /** Pagination metadata */
  meta: {
    /** Total number of pages available */
    total_pages: number;
    /** Total number of records across all pages */
    total_records: number;
  };
}

/**
 * Response interface for simple token prices
 * @public
 */
export interface SimpleTokenPriceResponse {
  data: {
    [tokenAddress: string]: {
      /** Current price in USD */
      price_usd: string;
      /** 24-hour trading volume */
      volume_24h?: string;
      /** Market capitalization */
      market_cap?: string;
    };
  };
}

/**
 * Formatted network interface
 * @public
 */
export interface FormattedNetwork {
  name: string;
  identifier: string;
  description: string | null;
  logoUrl: string | null;
  isMainnet: boolean;
}

/**
 * Formatted DEX interface
 * @public
 */
export interface FormattedDex {
  name: string;
  identifier: string;
  description: string | null;
  logoUrl: string | null;
  website: string | null;
}

/**
 * Formatted OHLCV interface
 * @public
 */
export interface FormattedOHLCV {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

/**
 * Formatted token price interface
 * @public
 */
export interface FormattedTokenPrice {
  address: string;
  priceUSD: string;
  volume24h?: string;
  marketCap?: string;
}

/**
 * Formatted pool interface
 * @public
 */
export interface FormattedPool {
  name: string;
  price: string;
  volume24h: string;
  trades24h: {
    total: number;
    buys: number;
    sells: number;
  };
  priceChange24h: string;
  poolAddress: string;
  baseTokenAddress: string;
  quoteTokenAddress: string;
  createdAt: string;
  reserveUSD: string;
  baseTokenPriceUSD: string;
  quoteTokenPriceUSD: string;
  baseTokenPriceNative: string;
}

// Re-export all types
export * from "./index";
