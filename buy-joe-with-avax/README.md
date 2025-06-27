# Sherry Mini App – Buy JOE with AVAX

This project is a **Next.js backend** that powers a Sherry Mini App for swapping AVAX to JOE tokens on the Avalanche network.
It serves as an example of how to integrate with the **LFJ (Let's Fucking Joe, a.k.a. Trader Joe)** protocol to create an interactive Web3 experience inside the Sherry ecosystem.

## What It Does

* Renders metadata for the Sherry Mini App to display a simple UI
* Provides pre-configured actions to buy JOE with preset AVAX amounts
* Supports custom AVAX input from the user to define a flexible swap
* Serializes a transaction to interact with the Trader Joe protocol via LFJ
* Enables Sherry to execute swaps through blockchain-compatible actions

## Tech Stack

* Next.js (App Router)
* TypeScript
* Viem for chain data and transaction signing
* @sherrylinks/sdk for metadata structure and parameter helpers

## Project Structure

```bash
.
├── app/
│   └── api/
│       └── buy-joe/
│           └── route.ts   # Handles GET for metadata and POST for serialized transactions
├── utils/
│   └── serializer.util.ts # Builds the transaction payload
├── README.md
```

## How It Works

The mini app exposes:

* `GET /api/buy-joe`: returns metadata with multiple swap actions (0.1, 0.5, 1 AVAX + custom input)
* `POST /api/buy-joe`: receives parameters and returns a serialized transaction ready for submission

## Setup

```bash
git clone https://github.com/SherryLabs/sherry-mini-app-examples.git
cd buy-joe-tokens
pnpm install
pnpm dev
```

## API Endpoints

### `GET /api/buy-joe`

Returns metadata for Sherry to render the UI.

### `POST /api/buy-joe?to=0x...&amount=0.5`

Returns a serialized transaction to swap `amount` AVAX for JOE, sending tokens to the `to` address.

## Example Use Case

A user installs the Sherry extension and clicks a post in X like:

```
https://app.sherry.social/action?url=https://your-backend.com/api/buy-joe
```

The Sherry UI renders with:

* Swap buttons (0.1 / 0.5 / 1 AVAX)
* An input for a custom amount and a button to execute the swap

## Related Links

* [https://github.com/sherrylabs/sdk](https://github.com/sherrylabs/sdk)
* [https://docs.traderjoexyz.com/](https://docs.traderjoexyz.com/)

## License

MIT License.
