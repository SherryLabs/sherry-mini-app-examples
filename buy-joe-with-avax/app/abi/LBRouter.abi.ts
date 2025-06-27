export const LBRouterAbi = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amountOutMin',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'uint256[]',
            name: 'pairBinSteps',
            type: 'uint256[]',
          },
          {
            internalType: 'enum ILBRouter.Version[]',
            name: 'versions',
            type: 'uint8[]',
          },
          {
            internalType: 'contract IERC20[]',
            name: 'tokenPath',
            type: 'address[]',
          },
        ],
        internalType: 'struct ILBRouter.Path',
        name: 'path',
        type: 'tuple',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
    ],
    name: 'swapExactNATIVEForTokens',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
];
