import { describe, expect, it, jest } from "@jest/globals";
import { GeckoTerminal } from "../../core/geckoterminal";

// Mock the logger to avoid console output during tests
jest.mock("../../utils/logger", () => ({
  createLogger: () => ({
    debug: jest.fn(),
    error: jest.fn(),
  }),
}));

// Mock fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

describe("GeckoTerminal", () => {
  let client: GeckoTerminal;

  beforeEach(() => {
    client = new GeckoTerminal();
    mockFetch.mockClear();
  });

  describe("constructor", () => {
    it("should initialize with default values", () => {
      const defaultClient = new GeckoTerminal();
      expect(defaultClient["network"]).toBe("cfx");
      expect(defaultClient["apiKey"]).toBeUndefined();
      expect(defaultClient["customBaseUrl"]).toBeUndefined();
    });

    it("should initialize with custom values", () => {
      const customClient = new GeckoTerminal("eth", "api-key", "https://custom.api.com");
      expect(customClient["network"]).toBe("eth");
      expect(customClient["apiKey"]).toBe("api-key");
      expect(customClient["customBaseUrl"]).toBe("https://custom.api.com");
    });
  });

  describe("getNetworks", () => {
    it("should fetch networks list with custom page", async () => {
      const mockResponse = {
        data: [
          {
            id: "1",
            type: "network",
            attributes: {
              name: "Conflux",
              identifier: "cfx",
              description: null,
              logo_url: null,
              is_mainnet: true,
            },
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      const result = await client.getNetworks(2);
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks?page=2",
        expect.any(Object)
      );
    });

    it("should use default page when not provided", async () => {
      const mockResponse = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      await client.getNetworks();
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks?page=1",
        expect.any(Object)
      );
    });
  });

  describe("getNetworkDexes", () => {
    it("should fetch network DEXes", async () => {
      const mockResponse = {
        data: [
          {
            id: "1",
            type: "dex",
            attributes: {
              name: "Swappi",
              identifier: "swappi",
              description: null,
              logo_url: null,
              website: null,
            },
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      const result = await client.getNetworkDexes("cfx", 1);
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/cfx/dexes?page=1",
        expect.objectContaining({
          headers: expect.objectContaining({
            Accept: "application/json",
            "Accept-Version": "2",
          }),
        })
      );
    });

    it("should use default network when not provided", async () => {
      const mockResponse = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      await client.getNetworkDexes();
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/cfx/dexes?page=1",
        expect.any(Object)
      );
    });
  });

  describe("getTopPools", () => {
    it("should fetch top pools", async () => {
      const mockResponse = {
        data: [
          {
            id: "1",
            type: "pool",
            attributes: {
              address: "0x123",
              name: "TOKEN1/TOKEN2",
              pool_created_at: "2023-01-01",
              reserve_in_usd: "1000000",
            },
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      const result = await client.getTopPools("cfx", "swappi", 1);
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/cfx/dexes/swappi/pools?page=1",
        expect.objectContaining({
          headers: expect.objectContaining({
            Accept: "application/json",
            "Accept-Version": "2",
          }),
        })
      );
    });

    it("should use default values when not provided", async () => {
      const mockResponse = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      await client.getTopPools();
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/cfx/dexes/swappi/pools?page=1",
        expect.any(Object)
      );
    });
  });

  describe("getTrendingPools", () => {
    it("should fetch trending pools with custom duration", async () => {
      const mockResponse = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      await client.getTrendingPools("cfx", "5m", 1);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/cfx/trending_pools?duration=5m&page=1",
        expect.any(Object)
      );
    });

    it("should use default values when not provided", async () => {
      const mockResponse = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      await client.getTrendingPools();
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/cfx/trending_pools?duration=24h&page=1",
        expect.any(Object)
      );
    });
  });

  describe("getNewPools", () => {
    it("should fetch new pools with custom network and page", async () => {
      const mockResponse = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      await client.getNewPools("eth", 2);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/eth/new_pools?page=2",
        expect.any(Object)
      );
    });

    it("should use default network when not provided", async () => {
      const mockResponse = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      await client.getNewPools(undefined, 1);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/cfx/new_pools?page=1",
        expect.any(Object)
      );
    });

    it("should use default page when not provided", async () => {
      const mockResponse = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      await client.getNewPools("cfx");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/cfx/new_pools?page=1",
        expect.any(Object)
      );
    });
  });

  describe("getTokenInfo", () => {
    it("should fetch token information with custom network", async () => {
      const mockResponse = {
        data: {
          id: "1",
          type: "token",
          attributes: {
            address: "0x123",
            name: "Test Token",
            symbol: "TEST",
            decimals: 18,
          },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      const result = await client.getTokenInfo("eth", "0x123");
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/eth/tokens/0x123",
        expect.any(Object)
      );
    });

    it("should use default network when not provided", async () => {
      const mockResponse = { data: {} };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      await client.getTokenInfo(undefined, "0x123");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/cfx/tokens/0x123",
        expect.any(Object)
      );
    });
  });

  describe("getTokenPools", () => {
    it("should fetch token pools with all parameters", async () => {
      const mockResponse = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      await client.getTokenPools("eth", "0x123", 2);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/eth/tokens/0x123/pools?page=2",
        expect.any(Object)
      );
    });

    it("should use default network when not provided", async () => {
      const mockResponse = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      await client.getTokenPools(undefined, "0x123");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/cfx/tokens/0x123/pools?page=1",
        expect.any(Object)
      );
    });

    it("should use default page when not provided", async () => {
      const mockResponse = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      await client.getTokenPools("cfx", "0x123");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/cfx/tokens/0x123/pools?page=1",
        expect.any(Object)
      );
    });
  });

  describe("getMultiTokenInfo", () => {
    it("should fetch multiple token information", async () => {
      const mockResponse = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      await client.getMultiTokenInfo("cfx", ["0x123", "0x456"]);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/cfx/tokens/multi/0x123,0x456",
        expect.any(Object)
      );
    });

    it("should throw error when too many addresses provided", async () => {
      const addresses = Array(31).fill("0x123");
      await expect(client.getMultiTokenInfo("cfx", addresses)).rejects.toThrow(
        "Maximum of 30 token addresses allowed per request"
      );
    });
  });

  describe("getPoolOHLCV", () => {
    it("should fetch OHLCV data with all parameters", async () => {
      const mockResponse = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      await client.getPoolOHLCV("cfx", "0x123", "hour", {
        aggregate: "2",
        before_timestamp: "1234567890",
        limit: "100",
        currency: "usd",
        token: "base",
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/cfx/pools/0x123/ohlcv/hour?aggregate=2&before_timestamp=1234567890&limit=100&currency=usd&token=base",
        expect.any(Object)
      );
    });

    it("should handle different timeframe options", async () => {
      const mockResponse = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      await client.getPoolOHLCV("cfx", "0x123", "minute");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/cfx/pools/0x123/ohlcv/minute",
        expect.any(Object)
      );
    });

    it("should handle token parameter as string", async () => {
      const mockResponse = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      await client.getPoolOHLCV("cfx", "0x123", "day", {
        token: "0x456",
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/cfx/pools/0x123/ohlcv/day?token=0x456",
        expect.any(Object)
      );
    });

    it("should use default network when not provided", async () => {
      const mockResponse = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      await client.getPoolOHLCV(undefined, "0x123", "hour");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/cfx/pools/0x123/ohlcv/hour",
        expect.any(Object)
      );
    });
  });

  describe("getSimpleTokenPrices", () => {
    it("should handle addresses with cfx_ prefix", async () => {
      const mockResponse = {
        data: {
          cfx_0x123: {
            price_usd: "1.23",
            volume_24h: "1000000",
            market_cap: "10000000",
          },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      const result = await client.getSimpleTokenPrices("cfx", ["cfx_0x123"], true, true);
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/simple/networks/cfx/token_price/cfx_0x123?include_24hr_vol=true&include_market_cap=true",
        expect.any(Object)
      );
    });

    it("should handle empty addresses array", async () => {
      const mockResponse = { data: {} };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      const result = await client.getSimpleTokenPrices("cfx", []);
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/simple/networks/cfx/token_price/?include_24hr_vol=false&include_market_cap=false",
        expect.any(Object)
      );
    });

    it("should handle different combinations of include parameters", async () => {
      const mockResponse = { data: {} };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      await client.getSimpleTokenPrices("cfx", ["0x123"], true, false);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/simple/networks/cfx/token_price/0x123?include_24hr_vol=true&include_market_cap=false",
        expect.any(Object)
      );
    });

    it("should throw error when too many addresses provided", async () => {
      const addresses = Array(31).fill("0x123");
      await expect(client.getSimpleTokenPrices("cfx", addresses)).rejects.toThrow(
        "Maximum of 30 addresses allowed per request"
      );
    });

    it("should use default network when not provided", async () => {
      const mockResponse = { data: {} };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      await client.getSimpleTokenPrices(undefined, ["0x123"]);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/simple/networks/cfx/token_price/0x123?include_24hr_vol=false&include_market_cap=false",
        expect.any(Object)
      );
    });
  });

  describe("searchPools", () => {
    it("should search pools with network filter", async () => {
      const mockResponse = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      await client.searchPools("WETH", "cfx", 1);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/search/pools?query=WETH&page=1&network=cfx",
        expect.any(Object)
      );
    });

    it("should search pools without network filter", async () => {
      const mockResponse = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      await client.searchPools("WETH");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/search/pools?query=WETH&page=1",
        expect.any(Object)
      );
    });
  });

  describe("getRecentlyUpdatedTokenInfo", () => {
    it("should fetch recently updated token information", async () => {
      const mockResponse = [
        {
          data: {
            id: "1",
            type: "token_info",
            attributes: {
              name: "Test Token",
              address: "0x123",
              symbol: "TEST",
              decimals: 18,
              coingecko_coin_id: "test-token",
              image_url: "https://example.com/logo.png",
              websites: ["https://test.com"],
              description: "Test description",
              discord_url: "https://discord.gg/test",
              telegram_handle: "test_token",
              twitter_handle: "test_token",
              categories: ["defi"],
              gt_category_ids: ["1"],
              gt_score: 80,
              metadata_updated_at: "2024-01-01T00:00:00Z",
            },
          },
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      const result = await client.getRecentlyUpdatedTokenInfo(1);
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/tokens/info_recently_updated?page=1",
        expect.objectContaining({
          headers: expect.objectContaining({
            Accept: "application/json",
            "Accept-Version": "2",
          }),
        })
      );
    });

    it("should use default page when not provided", async () => {
      const mockResponse = [{ data: [] }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      await client.getRecentlyUpdatedTokenInfo();
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/tokens/info_recently_updated?page=1",
        expect.any(Object)
      );
    });
  });

  describe("getTokensMetadata", () => {
    it("should fetch token metadata", async () => {
      const mockResponse = {
        data: {
          id: "1",
          type: "token_info",
          attributes: {
            name: "Test Token",
            address: "0x123",
            symbol: "TEST",
            decimals: 18,
            coingecko_coin_id: "test-token",
            image_url: "https://example.com/logo.png",
            websites: ["https://test.com"],
            description: "Test description",
            discord_url: "https://discord.gg/test",
            telegram_handle: "test_token",
            twitter_handle: "test_token",
            categories: ["defi"],
            gt_category_ids: ["1"],
            gt_score: 80,
            metadata_updated_at: "2024-01-01T00:00:00Z",
          },
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      const result = await client.getTokensMetadata("cfx", "0x123");
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/cfx/tokens/0x123/info",
        expect.objectContaining({
          headers: expect.objectContaining({
            Accept: "application/json",
            "Accept-Version": "2",
          }),
        })
      );
    });

    it("should use default network when not provided", async () => {
      const mockResponse = { data: {} };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      await client.getTokensMetadata(undefined, "0x123");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/cfx/tokens/0x123/info",
        expect.any(Object)
      );
    });
  });

  describe("getPoolTrades", () => {
    it("should fetch pool trades with minimum volume", async () => {
      const mockResponse = {
        data: [
          {
            id: "1",
            type: "trade",
            attributes: {
              block_number: 123456,
              block_timestamp: "2024-01-01T00:00:00Z",
              tx_hash: "0xabc",
              tx_from_address: "0x123",
              volume_in_usd: "1000",
              kind: "buy",
            },
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      const result = await client.getPoolTrades("cfx", "0x123", 1000);
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/cfx/pools/0x123/trades?trade_volume_in_usd_greater_than=1000",
        expect.any(Object)
      );
    });

    it("should fetch pool trades without minimum volume", async () => {
      const mockResponse = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      await client.getPoolTrades("cfx", "0x123");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/cfx/pools/0x123/trades",
        expect.any(Object)
      );
    });

    it("should use default network when not provided", async () => {
      const mockResponse = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      await client.getPoolTrades(undefined, "0x123");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/cfx/pools/0x123/trades",
        expect.any(Object)
      );
    });
  });

  describe("getPoolTokensMetadata", () => {
    it("should fetch pool tokens metadata", async () => {
      const mockResponse = [
        {
          data: {
            id: "1",
            type: "token_info",
            attributes: {
              name: "Test Token",
              address: "0x123",
              symbol: "TEST",
              decimals: 18,
              coingecko_coin_id: "test-token",
              image_url: "https://example.com/logo.png",
              websites: ["https://test.com"],
              description: "Test description",
            },
          },
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      const result = await client.getPoolTokensMetadata("cfx", "0x123");
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/cfx/pools/0x123/info",
        expect.any(Object)
      );
    });

    it("should use default network when not provided", async () => {
      const mockResponse = [{ data: {} }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      await client.getPoolTokensMetadata(undefined, "0x123");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/cfx/pools/0x123/info",
        expect.any(Object)
      );
    });
  });

  describe("getMultiPoolInfo", () => {
    it("should fetch multiple pool information", async () => {
      const mockResponse = {
        data: [
          {
            id: "1",
            type: "pool",
            attributes: {
              address: "0x123",
              name: "TOKEN1/TOKEN2",
              pool_created_at: "2023-01-01",
              reserve_in_usd: "1000000",
            },
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      const result = await client.getMultiPoolInfo("cfx", ["0x123", "0x456"]);
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/cfx/pools/multi/0x123,0x456",
        expect.any(Object)
      );
    });

    it("should handle empty pool addresses array", async () => {
      const mockResponse = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      const result = await client.getMultiPoolInfo("cfx", []);
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/cfx/pools/multi/",
        expect.any(Object)
      );
    });

    it("should use default network when not provided", async () => {
      const mockResponse = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      await client.getMultiPoolInfo(undefined, ["0x123"]);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/cfx/pools/multi/0x123",
        expect.any(Object)
      );
    });
  });

  describe("getPoolInfo", () => {
    it("should fetch pool information", async () => {
      const mockResponse = {
        data: [
          {
            id: "1",
            type: "pool",
            attributes: {
              address: "0x123",
              name: "TOKEN1/TOKEN2",
              pool_created_at: "2023-01-01",
              reserve_in_usd: "1000000",
              base_token_price_usd: "1.23",
              quote_token_price_usd: "4.56",
            },
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      const result = await client.getPoolInfo("cfx", "0x123");
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/cfx/pools/0x123",
        expect.any(Object)
      );
    });

    it("should use default network when not provided", async () => {
      const mockResponse = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      await client.getPoolInfo(undefined, "0x123");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/cfx/pools/0x123",
        expect.any(Object)
      );
    });
  });
});
