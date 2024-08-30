// import { TonClient } from "@ton/ton"
// import { useAsyncInitialize } from "./useAsyncInitialize"
// import { getHttpEndpoint } from "@orbs-network/ton-access"

// export function useTonClient() {
//   return useAsyncInitialize(
//     async () =>
//       new TonClient({
//         endpoint: await getHttpEndpoint({ network: "testnet" }),
//       })
//   )
// }

import { TonClient4 } from "@ton/ton"
import { useAsyncInitialize } from "./useAsyncInitialize"

export function useTonClient() {
  return useAsyncInitialize(
    async () => new TonClient4({ endpoint: "https://mainnet-v4.tonhubapi.com" })
  )
}
