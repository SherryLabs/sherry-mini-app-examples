# POAP Claim - Trigger

This is an example of how to build a mini-app that allows users to claim POAP (Proof of Attendance Protocol) badges through the Sherry Links SDK.

## Features

- POAP claim functionality
- Redis database for caching storage (optional)
- Compatible with Next.js and serverless deployments
- Integration with Sherry Links SDK

## How It Works

The trigger exposes:

* `GET /api/claim-poap`: returns metadata for the POAP claim action
* `POST /api/claim-poap`: claims a POAP for a user using POAP API

## Installation

### Prerequisites

- Node.js 18+
- pnpm

### Setup Steps

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/SherryLabs/sherry-mini-app-examples.git
   cd claim-poap
   pnpm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

   Fill in your POAP API credentials:
   ```env
   POAP_API_KEY=your_poap_api_key
   POAP_CLIENT_ID=your_poap_client_id
   POAP_CLIENT_SECRET=your_poap_client_secret
   POAP_EVENT_ID=your_event_id
   POAP_SECRET_CODE=your_secret_code
   REDIS_URL=redis_connection_string (optional for caching)
   ```

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

## Related Links

* [https://github.com/sherrylabs/sdk](https://github.com/sherrylabs/sdk)
* [https://documentation.poap.tech/reference/postactionsclaim-delivery-v2](https://documentation.poap.tech/reference/postactionsclaim-delivery-v2)

## License

MIT License.
