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
    it("should fetch networks list", async () => {
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

      const result = await client.getNetworks(1);
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks?page=1",
        expect.objectContaining({
          headers: expect.objectContaining({
            Accept: "application/json",
            "Accept-Version": "2",
          }),
        })
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
    it("should fetch new pools", async () => {
      const mockResponse = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      await client.getNewPools("cfx", 1);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/cfx/new_pools?page=1",
        expect.any(Object)
      );
    });
  });

  describe("getTokenInfo", () => {
    it("should fetch token information", async () => {
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

      const result = await client.getTokenInfo("cfx", "0x123");
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.geckoterminal.com/api/v2/networks/cfx/tokens/0x123",
        expect.objectContaining({
          headers: expect.objectContaining({
            Accept: "application/json",
            "Accept-Version": "2",
          }),
        })
      );
    });
  });

  describe("getTokenPools", () => {
    it("should fetch token pools", async () => {
      const mockResponse = { data: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers(),
      } as Response);

      await client.getTokenPools("cfx", "0x123", 1);
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
        expect.objectContaining({
          headers: expect.objectContaining({
            Accept: "application/json",
            "Accept-Version": "2",
          }),
        })
      );
    });

    it("should throw error when too many addresses provided", async () => {
      const addresses = Array(31).fill("0x123");
      await expect(client.getSimpleTokenPrices("cfx", addresses)).rejects.toThrow(
        "Maximum of 30 addresses allowed per request"
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
});
