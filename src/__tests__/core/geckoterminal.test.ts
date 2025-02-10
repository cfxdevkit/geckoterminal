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
global.fetch = jest.fn();

describe("GeckoTerminal", () => {
    let client: GeckoTerminal;

    beforeEach(() => {
        client = new GeckoTerminal();
        (global.fetch as jest.Mock).mockClear();
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

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            });

            const result = await client.getNetworks(1);
            expect(result).toEqual(mockResponse);
            expect(global.fetch).toHaveBeenCalledWith(
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

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            });

            const result = await client.getNetworkDexes("cfx", 1);
            expect(result).toEqual(mockResponse);
            expect(global.fetch).toHaveBeenCalledWith(
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

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            });

            const result = await client.getTopPools("cfx", "swappi", 1);
            expect(result).toEqual(mockResponse);
            expect(global.fetch).toHaveBeenCalledWith(
                "https://api.geckoterminal.com/api/v2/networks/cfx/dexes/swappi/pools?page=1",
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

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            });

            const result = await client.getTokenInfo("cfx", "0x123");
            expect(result).toEqual(mockResponse);
            expect(global.fetch).toHaveBeenCalledWith(
                "https://api.geckoterminal.com/api/v2/networks/cfx/tokens/0x123",
                expect.any(Object)
            );
        });
    });
}); 