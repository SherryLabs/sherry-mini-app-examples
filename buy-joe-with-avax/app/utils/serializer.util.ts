import { TokenAmount, Percent } from '@traderjoe-xyz/sdk-core';
import { PairV2, RouteV2, TradeV2, TradeOptions } from '@traderjoe-xyz/sdk-v2';
import {
  encodeFunctionData,
  parseUnits,
  createPublicClient,
  http
} from 'viem';
import { avalancheFuji, avalanche } from 'viem/chains';
import { LBRouterAbi } from '../abi/LBRouter.abi';
import {
  getJoeRouterAddressByChainId,
  getWAVAXTokenByChainId,
  getJOETokenByChainId,
} from '../constants/joe.constant'
import { serialize } from 'wagmi';

const chainMap = {
  43114: avalanche,
  43113: avalancheFuji,
};

function getChainById(chainId: number) {
  const chain = chainMap[chainId as keyof typeof chainMap];
  if (!chain) throw new Error('Unsupported chain ID');
  return chain;
}

export async function serializeTx(decimalValueIn: string, chainId: number, recipient: string) {
  const publicClient = createPublicClient({
    chain: getChainById(chainId),
    transport: http(),
  });

  const routerAddress = getJoeRouterAddressByChainId(chainId);
  const inputToken = getWAVAXTokenByChainId(chainId);
  const outputToken = getJOETokenByChainId(chainId);
  const BASES = [inputToken, outputToken];
  const typedValueInParsed = parseUnits(decimalValueIn, inputToken.decimals);
  const amountIn = new TokenAmount(inputToken, typedValueInParsed);

  // get all [Token, Token] combinations
  const allTokenPairs = PairV2.createAllTokenPairs(
    inputToken,
    outputToken,
    BASES,
  );
  // init PairV2 instances for the [Token, Token] pairs
  const allPairs = PairV2.initPairs(allTokenPairs);
  // generates all possible routes to consider
  const allRoutes = RouteV2.createAllRoutes(allPairs, inputToken, outputToken);
  // generates all possible TradeV2 instances
  const trades = await TradeV2.getTradesExactIn(
    allRoutes,
    amountIn,
    outputToken,
    true, // nativeIn
    false, // nativeOut
    publicClient,
    chainId,
  );
  // chooses the best trade
  const bestTrade = TradeV2.chooseBestTrade(
    trades.filter((t) => t != undefined),
    true, // isExactIn
  );

  if (!bestTrade) {
    throw new Error('No valid trade found');
  }

  // set slippage tolerance
  const userSlippageTolerance = new Percent('50', '10000');
  // set swap options
  const swapOptions: TradeOptions = {
    allowedSlippage: userSlippageTolerance,
    ttl: 3600, // 1 hour
    recipient,
    feeOnTransfer: false,
  };

  const { methodName, args, value } = bestTrade.swapCallParameters(swapOptions);

  const data = encodeFunctionData({
    abi: LBRouterAbi,
    functionName: methodName,
    args: args,
  });

  const tx = {
    to: routerAddress,
    data,
    value: BigInt(value),
    chainId,
  };

  return serialize(tx);
}
