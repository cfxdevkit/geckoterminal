import type {
  Network,
  NetworkDex,
  OHLCVDataPoint,
  Pool,
  FormattedNetwork,
  FormattedDex,
  FormattedOHLCV,
  FormattedTokenPrice,
  FormattedPool,
} from "../types/responses";

export const formatNetwork = (network: Network): FormattedNetwork => ({
  name: network.attributes.name,
  identifier: network.attributes.identifier,
  description: network.attributes.description,
  logoUrl: network.attributes.logo_url,
  isMainnet: network.attributes.is_mainnet,
});

export const formatDex = (dex: NetworkDex): FormattedDex => ({
  name: dex.attributes.name,
  identifier: dex.attributes.identifier,
  description: dex.attributes.description,
  logoUrl: dex.attributes.logo_url,
  website: dex.attributes.website,
});

export const formatOHLCV = (data: OHLCVDataPoint): FormattedOHLCV => ({
  datetime: data.datetime,
  open: data.open,
  high: data.high,
  low: data.low,
  close: data.close,
  volume: data.volume,
});

export const formatTokenPrice = (
  address: string,
  data: { price_usd: string; volume_24h?: string; market_cap?: string }
): FormattedTokenPrice => {
  const formatted: FormattedTokenPrice = {
    address,
    priceUSD: data.price_usd,
  };

  if (data.volume_24h) {
    formatted.volume24h = data.volume_24h;
  }

  if (data.market_cap) {
    formatted.marketCap = data.market_cap;
  }

  return formatted;
};

export const formatPool = (pool: Pool): FormattedPool => ({
  name: pool.attributes.name,
  price: pool.attributes.base_token_price_usd,
  volume24h: pool.attributes.volume_usd.h24,
  trades24h: {
    total: pool.attributes.transactions.h24.buys + pool.attributes.transactions.h24.sells,
    buys: pool.attributes.transactions.h24.buys,
    sells: pool.attributes.transactions.h24.sells,
  },
  priceChange24h: pool.attributes.price_change_percentage.h24,
  poolAddress: pool.attributes.address,
  baseTokenAddress: pool.relationships.base_token.data.id,
  quoteTokenAddress: pool.relationships.quote_token.data.id,
  createdAt: pool.attributes.pool_created_at,
  reserveUSD: pool.attributes.reserve_in_usd,
  baseTokenPriceUSD: pool.attributes.base_token_price_usd,
  quoteTokenPriceUSD: pool.attributes.quote_token_price_usd,
  baseTokenPriceNative: pool.attributes.base_token_price_native,
});

export const formatUtils = {
  number: (num: number | string): string => {
    if (!num) return "0";
    const value = Number(num);
    if (isNaN(value)) return "0";
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  },

  currency: (num: number | string): string => {
    if (!num) return "$0.00";
    const value = Number(num);
    if (isNaN(value)) return "$0.00";
    return `$${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  },

  percentage: (num: number | string | null): string => {
    if (num === null || !num) return "0%";
    const value = Number(num);
    if (isNaN(value)) return "0%";
    return `${value.toFixed(2)}%`;
  },

  date: (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString();
  },

  // New formatters
  compactCurrency: (value: number): string => {
    if (value === 0) return "$0";
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      notation: "compact",
      compactDisplay: "short",
    });

    if (value < 0) {
      return `-${formatter.format(Math.abs(value))}`;
    }
    return formatter.format(value);
  },

  monthYear: (date: Date): string => {
    return date.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
  },

  changePercent: (value: number): string => {
    const formatted = value.toFixed(2) + "%";
    return value >= 0 ? `+${formatted}` : formatted;
  },

  volatility: (value: number): string => {
    if (value < 0.1) return "Very Low";
    if (value < 0.25) return "Low";
    if (value < 0.5) return "Moderate";
    if (value < 1) return "High";
    return "Very High";
  },
};

// Add other formatting functions from DeFiLlamaWrapper
