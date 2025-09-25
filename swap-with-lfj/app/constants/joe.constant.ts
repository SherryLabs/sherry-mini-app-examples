import { Token, WNATIVE, ChainId } from '@traderjoe-xyz/sdk-core';
import { getAddress, Address } from 'viem';

const LB_ROUTER_ADDRESS: Record<number, Address> = {
  [43113]: getAddress('0x18556DA13313f3532c54711497A8FedAC273220E'),
  [43114]: getAddress('0x18556DA13313f3532c54711497A8FedAC273220E'),
};

const JOE_TOKEN_ADDRESS: Record<number, Address> = {
  [43113]: getAddress('0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd'),
  [43114]: getAddress('0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd'),
};


export function getJoeRouterAddressByChainId(chainId: ChainId): Address {
  return LB_ROUTER_ADDRESS[chainId];
}

export function getWAVAXTokenByChainId(chainId: ChainId): Token {
  return WNATIVE[chainId];
}

export function getJOETokenByChainId(chainId: ChainId): Token {
  return new Token(
        chainId,
        JOE_TOKEN_ADDRESS[chainId],
        18,
        "JOE",
        "JoeToken"
    );
}