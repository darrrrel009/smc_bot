import { useTonConnectUI, useTonAddress } from "@tonconnect/ui-react"

import { Sender, SenderArguments } from "@ton/core"
import { Dispatch, SetStateAction, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { updateUserData } from "../helper-functions/getUser"
import { increment } from "firebase/firestore"

export function useTonConnect(): {
  sender: Sender
  connected: boolean
  userAddress: string
  txStatus: boolean | null
  setTxStatus: Dispatch<SetStateAction<boolean | null>>
} {
  const [tonConnectUI] = useTonConnectUI()
  const TONAddress = useTonAddress(true)
  const [sendTx, setSendTx] = useState<boolean | null>(null)
  const [params] = useSearchParams()
  const userId = Number(params.get("userId"))
  return {
    sender: {
      send: async (args: SenderArguments) => {
        try {
          await tonConnectUI.sendTransaction({
            messages: [
              {
                address: args.to.toString(),
                amount: args.value.toString(),
                payload: args.body?.toBoc().toString("base64"),
              },
            ],
            validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
          })
          console.log("????", userId)
          await updateUserData(userId, {
            coinsEarned: increment(5000),
          })
          setSendTx(() => true)
        } catch (err) {
          console.log("err", userId)
          setSendTx(() => false)
        }
      },
    },

    connected: tonConnectUI?.connected,
    userAddress: TONAddress,
    txStatus: sendTx,
    setTxStatus: setSendTx,
  }
}
