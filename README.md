# Sherry Mini Apps Examples

This repository contains a collection of backend-powered **Mini Apps** built for the [Sherry](https://sherry.social) platform. Each example demonstrates how to structure and serve metadata and transactions for different types of Web3 interactions.

## About Sherry Mini Apps

Mini Apps are small Web3-native applications that run inside the Sherry browser extension. They are triggered by links and rendered directly in the post interface.

## What This Repo Includes

* Example apps using **Next.js App Router** as backend
* Integration with diferent Web3 protocols
* Clean and reusable structure for bootstrapping new apps

## Getting Started

To run a specific Mini App:

```bash
cd buy-joe-with-avax
pnpm install
pnpm dev
```

Each Mini App is self-contained and can be deployed independently (e.g., to Vercel).

## Build Your Own

Use these examples as a starting point to:

* Define interactive actions triggered by a Sherry link
* Handle parameters and user input securely
* Build lightweight and composable Web3-powered apps

## Resources

* [Sherry SDK](https://www.npmjs.com/package/@sherrylinks/sdk)
* [Sherry Docs](https://docs.sherry.social)

## License

MIT License
