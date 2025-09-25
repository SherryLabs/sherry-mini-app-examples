# Buy PNG with AVAX - Mini App

This project is a **Express.js backend** that powers a Sherry Mini App for swapping AVAX to PNG tokens on the Avalanche network.
It serves as an example of how to integrate with the **Pangolin Exchange** protocol to create an interactive Web3 experience inside the Sherry ecosystem.

## What It Does

* Renders metadata for the Sherry Mini App to display a simple UI
* Provides pre-configured actions to buy PNG with preset AVAX amounts
* Supports custom AVAX input from the user to define a flexible swap
* Serializes a transaction to interact with the Pangolin protocol v2 via Pangolin SDK
* Enables Sherry to execute swaps through blockchain-compatible actions

## Tech Stack

* Express.js (API)
* TypeScript
* Viem for chain data and transaction signing
* @sherrylinks/sdk for metadata structure and parameter helpers

## How It Works

The mini app exposes:

* `GET /api/buy-png`: returns metadata with multiple swap actions (0.1, 0.5, 1 AVAX + custom input)
* `POST /api/buy-png`: receives parameters and returns a serialized transaction ready for submission

## Installation

### Prerequisites

- Node.js 18+
- pnpm

### Setup Steps

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/SherryLabs/sherry-mini-app-examples.git
   cd swap-with-pangolin
   pnpm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

## Related Links

* [https://github.com/sherrylabs/sdk](https://github.com/sherrylabs/sdk)
* [https://github.com/pangolindex/sdk](https://github.com/pangolindex/sdk)

## License

MIT License.
