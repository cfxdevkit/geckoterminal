import { createLogger } from "../utils/logger";

const logger = createLogger("GeckoTerminalAPI");

/**
 * Base API client for GeckoTerminal
 * Handles HTTP requests to the GeckoTerminal API
 * @public
 */
export class GeckoTerminalAPI {
    /**
     * Base URL for the GeckoTerminal API
     */
    protected readonly BASE_URL = "https://api.geckoterminal.com/api/v2";
    protected readonly API_VERSION = "20230302";
    protected readonly DEFAULT_NETWORK = "cfx";
    protected readonly DEFAULT_DEX = "swappi";

    /**
     * Creates a new GeckoTerminal API client
     * @param network - Network identifier (defaults to cfx)
     * @param apiKey - Optional API key for authenticated requests
     * @param customBaseUrl - Optional custom base URL for the API
     */
    constructor(
        protected network: string = "cfx",
        protected apiKey?: string,
        protected customBaseUrl?: string
    ) {}

    /**
     * Makes a request to the GeckoTerminal API
     * @param endpoint - API endpoint to call
     * @param params - Query parameters to include in the request
     * @returns Promise with the API response
     * @internal
     */
    protected async fetchApi<T>(
        endpoint: string,
        params: Record<string, string> = {}
    ): Promise<T> {
        try {
            const url = new URL(endpoint, this.customBaseUrl || this.BASE_URL);
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    url.searchParams.append(key, String(value));
                }
            });

            logger.debug(`Fetching GeckoTerminal data from: ${url.toString()}`);
            const response = await fetch(url.toString(), {
                headers: {
                    Accept: `application/json;version=${this.API_VERSION}`,
                    ...(this.apiKey && { "X-API-KEY": this.apiKey }),
                },
            });

            if (!response.ok) {
                logger.error(`GeckoTerminal API request failed with status: ${response.status}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            logger.debug("API Response:", { endpoint, data });
            logger.debug("Data fetched successfully");
            return data;
        } catch (error) {
            logger.error(`Error fetching ${endpoint}:`, error);
            throw error;
        }
    }
}
