# @cfxdevkit/geckoterminal

A TypeScript library for interacting with the GeckoTerminal API, providing easy access to DEX pools, tokens, and trading data on the Conflux Network and other chains.

[![npm version](https://img.shields.io/npm/v/@cfxdevkit/geckoterminal)](https://www.npmjs.com/package/@cfxdevkit/geckoterminal)
[![Build Status](https://img.shields.io/github/actions/workflow/status/cfxdevkit/geckoterminal/ci.yml)](https://github.com/cfxdevkit/geckoterminal/actions)
[![Coverage Status](https://codecov.io/gh/cfxdevkit/geckoterminal/branch/main/graph/badge.svg)](https://codecov.io/gh/cfxdevkit/geckoterminal)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@cfxdevkit/geckoterminal)](https://bundlephobia.com/package/@cfxdevkit/geckoterminal)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node Version](https://img.shields.io/node/v/@cfxdevkit/geckoterminal)](https://www.npmjs.com/package/@cfxdevkit/geckoterminal)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/cfxdevkit/geckoterminal/pulls)

## Features

- 🚀 Full TypeScript support with comprehensive type definitions
- 📊 Access to GeckoTerminal's DEX pools and token data
- 💱 Real-time trading information and price data
- 📈 Built-in data formatting and utility functions
- 🔍 Detailed error handling and logging
- 📝 Well-documented API methods
- ⚡ Modern ES6+ syntax

## Installation

```bash
npm install @cfxdevkit/geckoterminal
```

## Quick Start

```typescript
import { GeckoTerminal } from '@cfxdevkit/geckoterminal';

const client = new GeckoTerminal();

// Get all networks
const networks = await client.getNetworks();

// Get DEXes for Conflux network
const dexes = await client.getNetworkDexes('cfx');

// Get top pools for Swappi on Conflux
const pools = await client.getTopPools('cfx', 'swappi');
```

## Examples

### Network and DEX Information

```typescript
const client = new GeckoTerminal();

// Get all supported networks
const networks = await client.getNetworks();

// Get DEXes for a specific network
const dexes = await client.getNetworkDexes('cfx');
```

### Pool Information

```typescript
// Get top pools for a specific DEX
const topPools = await client.getTopPools('cfx', 'swappi');

// Get trending pools
const trendingPools = await client.getTrendingPools('cfx', '24h');

// Get new pools
const newPools = await client.getNewPools('cfx');

// Get specific pool information
const poolInfo = await client.getPoolInfo('cfx', 'pool_address');

// Get pool OHLCV data
const ohlcv = await client.getPoolOHLCV('cfx', 'pool_address', 'hour', {
    limit: '3'
});
```

### Token Information

```typescript
// Get token information
const tokenInfo = await client.getTokenInfo('cfx', 'token_address');

// Get pools for a specific token
const tokenPools = await client.getTokenPools('cfx', 'token_address');

// Get multiple token information
const multiTokenInfo = await client.getMultiTokenInfo('cfx', ['token1', 'token2']);

// Get simple token prices
const tokenPrices = await client.getSimpleTokenPrices('cfx', ['token1', 'token2'], true, true);
```

### Search Functionality

```typescript
// Search for pools
const searchResults = await client.searchPools('WETH', 'cfx');
```

### Formatting Utilities

The library includes various formatting utilities for data presentation:

```typescript
import { formatUtils } from '@cfxdevkit/geckoterminal';

// Format currency
formatUtils.currency(1234.5678); // "$1,234.57"
formatUtils.compactCurrency(1234567); // "$1.23M"

// Format percentages
formatUtils.percentage(12.345); // "12.35%"
formatUtils.changePercent(-12.345); // "-12.35%"

// Format dates
formatUtils.date(1612137600); // "2021-02-01 00:00:00"
formatUtils.monthYear(new Date("2024-02-15")); // "February 2024"

// Classify volatility
formatUtils.volatility(0.75); // "High"
```

## API Reference

### Networks and DEXes

#### Get Networks
```typescript
const networks = await client.getNetworks();
```

#### Get Network DEXes
```typescript
const dexes = await client.getNetworkDexes('cfx');
```

### Pools

#### Get Top Pools
```typescript
const pools = await client.getTopPools('cfx', 'swappi');
```

#### Get Trending Pools
```typescript
const trending = await client.getTrendingPools('cfx', '24h');
```

#### Get Pool Information
```typescript
const info = await client.getPoolInfo('cfx', 'pool_address');
```

### Tokens

#### Get Token Information
```typescript
const token = await client.getTokenInfo('cfx', 'token_address');
```

#### Get Token Prices
```typescript
const prices = await client.getSimpleTokenPrices('cfx', ['token_address']);
```

## Development

### Prerequisites

- Node.js >= 16.0.0
- npm

### Setup

1. Clone the repository:
```bash
git clone https://github.com/cfxdevkit/geckoterminal.git
cd geckoterminal
```

2. Install dependencies:
```bash
npm install
```

### Available Scripts

- `npm run build` - Build the library
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Lint the code
- `npm run format` - Format the code
- `npm run example` - Run example usage script

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Links

- [GitHub Repository](https://github.com/cfxdevkit/geckoterminal)
- [Issue Tracker](https://github.com/cfxdevkit/geckoterminal/issues)
- [Documentation](https://cfxdevkit.github.io/geckoterminal)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [GeckoTerminal](https://www.geckoterminal.com/) for providing the API
