/**
 * Base interface for API response attributes
 */
interface BaseAttributes {
    id: string;
    type: string;
}

/**
 * Token interface
 */
export interface Token extends BaseAttributes {
    attributes: {
        address: string;
        name: string;
        symbol: string;
        decimals: number;
        price_usd: string | null;
        total_supply: string | null;
    };
}

/**
 * Pool interface
 */
export interface Pool extends BaseAttributes {
    attributes: {
        address: string;
        name: string;
        pool_created_at: string;
        reserve_in_usd: string;
        base_token_price_usd: string;
        quote_token_price_usd: string;
        base_token_price_native: string;
        quote_token_price_native: string;
        base_token_price_native_currency: string;
        volume_usd: {
            h24: string;
            h6: string;
            m5: string;
        };
        price_change_percentage: {
            h24: string;
            h6: string;
            m5: string;
        };
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
 * Response interface for pools endpoints
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
 */
export interface TokenInfoMetadata extends BaseAttributes {
    attributes: {
        name: string;
        address: string;
        symbol: string;
        decimals: number;
        coingecko_coin_id: string | null;
        image_url: string | null;
        websites: string[];
        description: string | null;
        discord_url: string | null;
        telegram_handle: string | null;
        twitter_handle: string | null;
        categories: string[] | null;
        gt_category_ids: string[] | null;
        gt_score: number | null;
        metadata_updated_at: string | null;
    };
}

/**
 * Response interface for token info metadata
 */
export interface TokenInfoMetadataResponse {
    data: TokenInfoMetadata[];
}

/**
 * Token info response interface
 */
export interface TokenInfo {
    data: Token;
    included?: Token[];
}

/**
 * Response interface for multiple tokens
 */
export interface MultiTokenResponse {
    data: Token[];
}

/**
 * Response interface for multiple pools
 */
export interface MultiPoolResponse {
    data: Pool[];
}

/**
 * OHLCV data point interface
 */
interface OHLCVDataPoint {
    datetime: string;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
}

/**
 * OHLCV response interface
 */
export interface OHLCVResponse {
    data: {
        id: string;
        type: string;
        attributes: OHLCVDataPoint[];
    };
}

/**
 * Network DEX interface
 */
interface NetworkDex extends BaseAttributes {
    attributes: {
        name: string;
        identifier: string;
        description: string | null;
        logo_url: string | null;
        website: string | null;
    };
}

/**
 * Response interface for network DEXes
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
 * Network interface
 */
interface Network extends BaseAttributes {
    attributes: {
        name: string;
        identifier: string;
        description: string | null;
        logo_url: string | null;
        is_mainnet: boolean;
    };
}

/**
 * Response interface for networks
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
 * Response interface for trending pools (same structure as PoolsResponse)
 */
export interface TrendingPoolsResponse extends PoolsResponse {}

/**
 * Response interface for simple token prices
 */
export interface SimpleTokenPriceResponse {
    data: {
        [tokenAddress: string]: {
            price_usd: string;
            volume_24h?: string;
            market_cap?: string;
        };
    };
}

/**
 * Trade interface
 */
export interface Trade {
    id: string;
    type: string;
    attributes: {
        block_number: number;
        block_timestamp: string;
        tx_hash: string;
        tx_from_address: string;
        from_token_amount: string;
        to_token_amount: string;
        price_from_in_currency_token: string;
        price_to_in_currency_token: string;
        price_from_in_usd: string;
        price_to_in_usd: string;
        kind: string;
        volume_in_usd: string;
        from_token_address: string;
        to_token_address: string;
    };
}

/**
 * Response interface for trades
 */
export interface TradesResponse {
    data: Trade[];
}
