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
  protected readonly API_VERSION = "2";
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
  ) {
    logger.debug("Initializing GeckoTerminalAPI", {
      network,
      hasApiKey: !!apiKey,
      baseUrl: customBaseUrl || this.BASE_URL,
      apiVersion: this.API_VERSION,
    });
  }

  /**
   * Makes a request to the GeckoTerminal API
   * @param endpoint - API endpoint to call
   * @param params - Query parameters to include in the request
   * @returns Promise with the API response
   * @internal
   */
  protected async fetchApi<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    try {
      // Remove any leading slashes and ensure proper endpoint format
      const normalizedEndpoint = endpoint.replace(/^\/+/, "");
      const baseUrl = (this.customBaseUrl || this.BASE_URL).replace(/\/+$/, "");
      const url = new URL(`${baseUrl}/${normalizedEndpoint}`);

      // Add query parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });

      const headers = {
        Accept: "application/json",
        "Accept-Version": this.API_VERSION,
        ...(this.apiKey && { "X-API-KEY": this.apiKey }),
      };

      const fullUrl = url.toString();
      logger.debug("Making API request", {
        method: "GET",
        url: fullUrl,
        endpoint: normalizedEndpoint,
        headers,
        params,
      });

      const response = await fetch(fullUrl, { headers });

      // Convert headers to a plain object for logging
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      logger.debug("Received API response", {
        url: fullUrl,
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error("API request failed", {
          url: fullUrl,
          status: response.status,
          statusText: response.statusText,
          errorText,
        });
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }

      const data = await response.json();
      logger.debug("Successfully parsed response data", {
        url: fullUrl,
        endpoint: normalizedEndpoint,
        dataKeys: Object.keys(data),
      });
      return data;
    } catch (error) {
      logger.error("Error in API request", {
        endpoint,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }
}
