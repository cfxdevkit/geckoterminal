import { formatUtils } from "../../formatters";
import { describe, expect, it } from "@jest/globals";
import {
  formatNetwork,
  formatDex,
  formatOHLCV,
  formatTokenPrice,
  formatPool,
} from "../../formatters";
import type { Network, NetworkDex, OHLCVDataPoint, Pool } from "../../types/responses";

describe("formatUtils", () => {
  describe("number", () => {
    it("should format numbers correctly", () => {
      expect(formatUtils.number(1234.5678)).toBe("1,234.57");
      expect(formatUtils.number("1234.5678")).toBe("1,234.57");
    });

    it("should handle edge cases", () => {
      expect(formatUtils.number(0)).toBe("0");
      expect(formatUtils.number("")).toBe("0");
      expect(formatUtils.number("invalid")).toBe("0");
    });
  });

  describe("currency", () => {
    it("should format currency correctly", () => {
      expect(formatUtils.currency(1234.5678)).toBe("$1,234.57");
      expect(formatUtils.currency("1234.5678")).toBe("$1,234.57");
    });

    it("should handle edge cases", () => {
      expect(formatUtils.currency(0)).toBe("$0.00");
      expect(formatUtils.currency("")).toBe("$0.00");
      expect(formatUtils.currency("invalid")).toBe("$0.00");
    });
  });

  describe("percentage", () => {
    it("should format percentages correctly", () => {
      expect(formatUtils.percentage(12.345)).toBe("12.35%");
      expect(formatUtils.percentage("12.345")).toBe("12.35%");
    });

    it("should handle edge cases", () => {
      expect(formatUtils.percentage(0)).toBe("0%");
      expect(formatUtils.percentage("")).toBe("0%");
      expect(formatUtils.percentage(null)).toBe("0%");
      expect(formatUtils.percentage("invalid")).toBe("0%");
    });
  });

  describe("date", () => {
    it("should format timestamps correctly", () => {
      const timestamp = 1612137600; // 2021-02-01 00:00:00 UTC
      expect(formatUtils.date(timestamp)).toMatch(/2021/);
    });
  });

  describe("compactCurrency", () => {
    it("should format numbers to compact currency", () => {
      expect(formatUtils.compactCurrency(1234)).toBe("$1.23K");
      expect(formatUtils.compactCurrency(1234567)).toBe("$1.23M");
      expect(formatUtils.compactCurrency(1234567890)).toBe("$1.23B");
    });

    it("should handle zero and negative numbers", () => {
      expect(formatUtils.compactCurrency(0)).toBe("$0");
      expect(formatUtils.compactCurrency(-1234)).toBe("-$1.23K");
    });
  });

  describe("changePercent", () => {
    it("should format percentage changes", () => {
      expect(formatUtils.changePercent(12.345)).toBe("+12.35%");
      expect(formatUtils.changePercent(-12.345)).toBe("-12.35%");
    });

    it("should handle zero and extreme values", () => {
      expect(formatUtils.changePercent(0)).toBe("+0.00%");
      expect(formatUtils.changePercent(1000)).toBe("+1000.00%");
    });
  });

  describe("monthYear", () => {
    it("should format dates to month/year", () => {
      const date = new Date("2024-02-15");
      expect(formatUtils.monthYear(date)).toBe("February 2024");
    });

    it("should handle different months", () => {
      expect(formatUtils.monthYear(new Date("2024-01-01"))).toBe("January 2024");
      expect(formatUtils.monthYear(new Date("2024-12-31"))).toBe("December 2024");
    });
  });

  describe("volatility", () => {
    it("should classify volatility correctly", () => {
      expect(formatUtils.volatility(0.05)).toBe("Very Low");
      expect(formatUtils.volatility(0.15)).toBe("Low");
      expect(formatUtils.volatility(0.35)).toBe("Moderate");
      expect(formatUtils.volatility(0.75)).toBe("High");
      expect(formatUtils.volatility(1.5)).toBe("Very High");
    });
  });
});

describe("Formatters", () => {
  describe("formatNetwork", () => {
    it("should format network data correctly", () => {
      const input: Network = {
        id: "1",
        type: "network",
        attributes: {
          name: "Conflux",
          identifier: "cfx",
          description: "Test description",
          logo_url: "https://example.com/logo.png",
          is_mainnet: true,
        },
      };

      const result = formatNetwork(input);
      expect(result).toEqual({
        name: "Conflux",
        identifier: "cfx",
        description: "Test description",
        logoUrl: "https://example.com/logo.png",
        isMainnet: true,
      });
    });

    it("should handle null values", () => {
      const input: Network = {
        id: "1",
        type: "network",
        attributes: {
          name: "Conflux",
          identifier: "cfx",
          description: null,
          logo_url: null,
          is_mainnet: true,
        },
      };

      const result = formatNetwork(input);
      expect(result).toEqual({
        name: "Conflux",
        identifier: "cfx",
        description: null,
        logoUrl: null,
        isMainnet: true,
      });
    });
  });

  describe("formatDex", () => {
    it("should format DEX data correctly", () => {
      const input: NetworkDex = {
        id: "1",
        type: "dex",
        attributes: {
          name: "Swappi",
          identifier: "swappi",
          description: "Test description",
          logo_url: "https://example.com/logo.png",
          website: "https://example.com",
        },
      };

      const result = formatDex(input);
      expect(result).toEqual({
        name: "Swappi",
        identifier: "swappi",
        description: "Test description",
        logoUrl: "https://example.com/logo.png",
        website: "https://example.com",
      });
    });

    it("should handle null values", () => {
      const input: NetworkDex = {
        id: "1",
        type: "dex",
        attributes: {
          name: "Swappi",
          identifier: "swappi",
          description: null,
          logo_url: null,
          website: null,
        },
      };

      const result = formatDex(input);
      expect(result).toEqual({
        name: "Swappi",
        identifier: "swappi",
        description: null,
        logoUrl: null,
        website: null,
      });
    });
  });

  describe("formatOHLCV", () => {
    it("should format OHLCV data correctly", () => {
      const input: OHLCVDataPoint = {
        datetime: "2023-01-01T00:00:00Z",
        open: "1.0",
        high: "2.0",
        low: "0.5",
        close: "1.5",
        volume: "1000",
      };

      const result = formatOHLCV(input);
      expect(result).toEqual({
        datetime: "2023-01-01T00:00:00Z",
        open: "1.0",
        high: "2.0",
        low: "0.5",
        close: "1.5",
        volume: "1000",
      });
    });
  });

  describe("formatTokenPrice", () => {
    it("should format token price data correctly with all fields", () => {
      const result = formatTokenPrice("0x123", {
        price_usd: "1.23",
        volume_24h: "1000000",
        market_cap: "10000000",
      });

      expect(result).toEqual({
        address: "0x123",
        priceUSD: "1.23",
        volume24h: "1000000",
        marketCap: "10000000",
      });
    });

    it("should handle missing optional fields", () => {
      const result = formatTokenPrice("0x123", {
        price_usd: "1.23",
      });

      expect(result).toEqual({
        address: "0x123",
        priceUSD: "1.23",
      });
    });
  });

  describe("formatPool", () => {
    it("should format pool data correctly", () => {
      const input: Pool = {
        id: "1",
        type: "pool",
        attributes: {
          address: "0x123",
          name: "TOKEN1/TOKEN2",
          pool_created_at: "2023-01-01T00:00:00Z",
          reserve_in_usd: "1000000",
          base_token_price_usd: "1.23",
          quote_token_price_usd: "4.56",
          base_token_price_native: "0.1",
          quote_token_price_native: "0.2",
          base_token_price_native_currency: "CFX",
          volume_usd: {
            h24: "100000",
            h6: "50000",
            m5: "10000",
          },
          price_change_percentage: {
            h24: "1.5",
            h6: "0.8",
            m5: "0.2",
          },
          transactions: {
            h24: { buys: 100, sells: 50 },
            h6: { buys: 50, sells: 25 },
            m5: { buys: 10, sells: 5 },
          },
        },
        relationships: {
          base_token: { data: { id: "base_token", type: "token" } },
          quote_token: { data: { id: "quote_token", type: "token" } },
          dex: { data: { id: "dex", type: "dex" } },
        },
      };

      const result = formatPool(input);
      expect(result).toEqual({
        name: "TOKEN1/TOKEN2",
        price: "1.23",
        volume24h: "100000",
        trades24h: {
          total: 150,
          buys: 100,
          sells: 50,
        },
        priceChange24h: "1.5",
        poolAddress: "0x123",
        baseTokenAddress: "base_token",
        quoteTokenAddress: "quote_token",
        createdAt: "2023-01-01T00:00:00Z",
        reserveUSD: "1000000",
        baseTokenPriceUSD: "1.23",
        quoteTokenPriceUSD: "4.56",
        baseTokenPriceNative: "0.1",
      });
    });
  });
});
