import {
  TokenAmount,
  Trade,
  TradeType,
  Route,
  Percent,
  Fetcher,
  ChainId,
} from "@pangolindex/sdk";
import { JsonRpcProvider } from "@ethersproject/providers";
import { encodeFunctionData, parseUnits } from "viem";
import { PangolinRouterAbi } from "../abi/PangolinRouter.abi.js";
import {
  getPangolinRouterAddressByChainId,
  getWAVAXTokenByChainId,
  getPangolinTokenByChainId,
} from "../constants/pangolin.constant.js";

export async function serializeTx(decimalValueIn: string, chainId: ChainId, recipient: string): Promise<string> {
  const routerAddress = getPangolinRouterAddressByChainId(chainId);
  const inputToken = getWAVAXTokenByChainId(chainId);
  const outputToken = getPangolinTokenByChainId(chainId);
  const typedValueInParsed = parseUnits(decimalValueIn, inputToken.decimals);

  const rpcUrl =
    chainId === 43114
      ? "https://api.avax.network/ext/bc/C/rpc"
      : "https://api.avax-test.network/ext/bc/C/rpc";

  const provider = new JsonRpcProvider(rpcUrl, {
    name: chainId === 43114 ? "avalanche" : "avalancheFuji",
    chainId,
  });

  const pair = await Fetcher.fetchPairData(inputToken, outputToken, provider);

  const route = new Route([pair], inputToken, outputToken);
  const swapPath = route.path.map((token) => token.address);

  const trade = new Trade(
    route,
    new TokenAmount(inputToken, typedValueInParsed.toString()),
    TradeType.EXACT_INPUT
  );

  // set slippage tolerance
  const userSlippageTolerance = new Percent("50", "10000");

  const amountOutMin = trade
    .minimumAmountOut(userSlippageTolerance)
    .raw.toString();

  const deadline = BigInt(Math.floor(Date.now() / 1000) + 600);

  let args = [amountOutMin, swapPath, recipient, deadline];

  const data = encodeFunctionData({
    abi: PangolinRouterAbi,
    functionName: "swapExactAVAXForTokens",
    args,
  });

  const tx = {
    to: routerAddress,
    data,
    value: BigInt(typedValueInParsed),
    chainId,
  };

  // Simple serialization for Express (no wagmi needed)
  return JSON.stringify({
    to: tx.to,
    data: tx.data,
    value: tx.value.toString(),
    chainId: tx.chainId,
  });
}
