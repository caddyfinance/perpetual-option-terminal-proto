import { http, createConfig } from 'wagmi'
import { base, baseGoerli } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [baseGoerli, base],
  connectors: [
    injected(),
  ],
  transports: {
    [base.id]: http(),
    [baseGoerli.id]: http(),
  },
})