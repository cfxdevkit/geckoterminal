import { describe, expect, it, jest } from "@jest/globals";
import { GeckoTerminalAPI } from "../../core/api";

// Mock fetch
global.fetch = jest.fn();

describe("GeckoTerminalAPI", () => {
    let api: GeckoTerminalAPI;

    beforeEach(() => {
        api = new GeckoTerminalAPI();
        (global.fetch as jest.Mock).mockClear();
    });

    it("should use default base URL", async () => {
        const mockResponse = { data: [] };
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse),
        });

        await api["fetchApi"]("/test");

        expect(global.fetch).toHaveBeenCalledWith(
            "https://api.geckoterminal.com/api/v2/test",
            expect.objectContaining({
                headers: expect.objectContaining({
                    Accept: "application/json;version=20230302",
                }),
            })
        );
    });

    it("should use custom base URL when provided", async () => {
        const customBaseUrl = "https://custom.api.com";
        api = new GeckoTerminalAPI("cfx", undefined, customBaseUrl);
        const mockResponse = { data: [] };
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse),
        });

        await api["fetchApi"]("/test");

        expect(global.fetch).toHaveBeenCalledWith(
            `${customBaseUrl}/test`,
            expect.objectContaining({
                headers: expect.objectContaining({
                    Accept: "application/json;version=20230302",
                }),
            })
        );
    });

    it("should include API key in headers when provided", async () => {
        const apiKey = "test-api-key";
        api = new GeckoTerminalAPI("cfx", apiKey);
        const mockResponse = { data: [] };
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse),
        });

        await api["fetchApi"]("/test");

        expect(global.fetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                headers: expect.objectContaining({
                    Accept: "application/json;version=20230302",
                    "X-API-KEY": apiKey,
                }),
            })
        );
    });

    it("should handle query parameters correctly", async () => {
        const mockResponse = { data: [] };
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse),
        });

        await api["fetchApi"]("/test", { page: "1", limit: "10" });

        expect(global.fetch).toHaveBeenCalledWith(
            "https://api.geckoterminal.com/api/v2/test?page=1&limit=10",
            expect.any(Object)
        );
    });

    it("should throw error on non-ok response", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 404,
        });

        await expect(api["fetchApi"]("/test")).rejects.toThrow("HTTP error! status: 404");
    });

    it("should throw error on network failure", async () => {
        const networkError = new Error("Network error");
        (global.fetch as jest.Mock).mockRejectedValueOnce(networkError);

        await expect(api["fetchApi"]("/test")).rejects.toThrow(networkError);
    });
});
