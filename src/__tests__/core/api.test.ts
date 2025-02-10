import { describe, expect, it, jest } from "@jest/globals";
import { GeckoTerminalAPI } from "../../core/api";

// Mock fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

describe("GeckoTerminalAPI", () => {
  let api: GeckoTerminalAPI;

  beforeEach(() => {
    api = new GeckoTerminalAPI();
    mockFetch.mockClear();
  });

  it("should use default base URL and correct API version", async () => {
    const mockResponse = { data: [] };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
      headers: new Headers(),
    } as Response);

    await api["fetchApi"]("test");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.geckoterminal.com/api/v2/test",
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/json",
          "Accept-Version": "2",
        }),
      })
    );
  });

  it("should use custom base URL when provided", async () => {
    const customBaseUrl = "https://custom.api.com";
    api = new GeckoTerminalAPI("cfx", undefined, customBaseUrl);
    const mockResponse = { data: [] };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
      headers: new Headers(),
    } as Response);

    await api["fetchApi"]("test");

    expect(mockFetch).toHaveBeenCalledWith(
      `${customBaseUrl}/test`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/json",
          "Accept-Version": "2",
        }),
      })
    );
  });

  it("should include API key in headers when provided", async () => {
    const apiKey = "test-api-key";
    api = new GeckoTerminalAPI("cfx", apiKey);
    const mockResponse = { data: [] };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
      headers: new Headers(),
    } as Response);

    await api["fetchApi"]("test");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/json",
          "Accept-Version": "2",
          "X-API-KEY": apiKey,
        }),
      })
    );
  });

  it("should handle query parameters correctly", async () => {
    const mockResponse = { data: [] };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
      headers: new Headers(),
    } as Response);

    await api["fetchApi"]("test", { page: "1", limit: "10" });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.geckoterminal.com/api/v2/test?page=1&limit=10",
      expect.any(Object)
    );
  });

  it("should handle leading slashes in endpoint correctly", async () => {
    const mockResponse = { data: [] };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
      headers: new Headers(),
    } as Response);

    await api["fetchApi"]("/test");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.geckoterminal.com/api/v2/test",
      expect.any(Object)
    );
  });

  it("should throw error on non-ok response", async () => {
    const errorText = "Not Found";
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: () => Promise.resolve(errorText),
      headers: new Headers(),
    } as Response);

    await expect(api["fetchApi"]("test")).rejects.toThrow("HTTP error! status: 404");
  });

  it("should throw error on network failure", async () => {
    const networkError = new Error("Network error");
    mockFetch.mockRejectedValueOnce(networkError);

    await expect(api["fetchApi"]("test")).rejects.toThrow(networkError);
  });
});
