# Sherry Trigger Examples

This repository contains example implementations of **Sherry triggers** - interactive Web3 applications that run within the Sherry SDK.

## What is Sherry SDK?

Sherry SDK is a TypeScript-first toolkit for building interactive Web3 triggers that embed directly within social media posts. Transform static content into dynamic blockchain experiences that users can interact with seamlessly.

## Repository Overview

This collection showcases different types of triggers, each demonstrating unique integration patterns:

### Token Swapping Examples
Two examples show how to integrate with different DEX protocols:
- [**Swap with LFJ**](./swap-with-lfj/): Swap AVAX to JOE tokens using Trader Joe's LFJ protocol
- [**Swap with Pangolin**](./swap-with-pangolin/): Swap AVAX to PNG tokens using Pangolin Exchange

### NFT & Badge Examples
- [**Claim POAP**](./claim-poap/): Claim POAP (Proof of Attendance Protocol) badges through API integration

## Architecture Pattern

Each trigger follows a consistent API pattern:

- **GET endpoint**: Returns metadata with available actions and UI configuration
- **POST endpoint**: Processes user parameters and returns serialized transactions

This standardized approach ensures compatibility with the Sherry platform while maintaining flexibility for different protocol integrations.

## Getting Started

Each example includes its own setup instructions and environment configuration.