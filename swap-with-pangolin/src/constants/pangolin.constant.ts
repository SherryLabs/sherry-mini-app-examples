import { Token, WAVAX, ChainId } from '@pangolindex/sdk';
import { getAddress, Address } from 'viem';

const PANGOLIN_ROUTER_ADDRESS: Record<number, Address> = {
  43113: getAddress('0x688d21b0B8Dc35971AF58cFF1F7Bf65639937860'),
  43114: getAddress('0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106'),
};

const PNG_TOKEN_ADDRESS: Record<number, Address> = {
  43113: getAddress('0x60781C2586D68229fde47564546784ab3fACA982'),
  43114: getAddress('0x60781C2586D68229fde47564546784ab3fACA982'),
};

export function getPangolinRouterAddressByChainId(chainId: ChainId): Address {
  return PANGOLIN_ROUTER_ADDRESS[chainId];
}

export function getWAVAXTokenByChainId(chainId: ChainId): Token {
  return WAVAX[chainId];
}

export function getPangolinTokenByChainId(chainId: ChainId): Token {
  return new Token(
    chainId,
    PNG_TOKEN_ADDRESS[chainId],
    18,
    "PNG",
    "Pangolin Token"
  );
}