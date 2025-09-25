# Buy JOE with AVAX - Mini App

This project is a **Next.js backend** that powers a Sherry Mini App for swapping AVAX to JOE tokens on the Avalanche network.
It serves as an example of how to integrate with the **LFJ (a.k.a. Trader Joe)** protocol to create an interactive Web3 experience inside the Sherry ecosystem.

## What It Does

* Renders metadata for the Sherry Mini App to display a simple UI
* Provides pre-configured actions to buy JOE with preset AVAX amounts
* Supports custom AVAX input from the user to define a flexible swap
* Serializes a transaction to interact with the LFJ protocol v1 and v2.x via LFJ SDK
* Enables Sherry to execute swaps through blockchain-compatible actions

## Tech Stack

* Next.js (App Router)
* TypeScript
* Viem for chain data and transaction signing
* @sherrylinks/sdk for metadata structure and parameter helpers

## How It Works

The mini app exposes:

* `GET /api/buy-joe`: returns metadata with multiple swap actions (0.1, 0.5, 1 AVAX + custom input)
* `POST /api/buy-joe`: receives parameters and returns a serialized transaction ready for submission

## Installation

### Prerequisites

- Node.js 18+
- pnpm

### Setup Steps

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/SherryLabs/sherry-mini-app-examples.git
   cd swap-with-lfj
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
* [https://developers.lfj.gg/sdk/intro](https://developers.lfj.gg/sdk/intro)

## License

MIT License.
