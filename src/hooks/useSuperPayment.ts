import { toNano } from "ton-core"
import { SuperPaymentFactory } from "../contracts/SuperPaymentFactory"
import { superPaymentFactoryAddress } from "../contracts/constants"
import { useTonClient } from "./useTonClient"
import { useTonConnect } from "./useTonConnect"
// import { updateUserData } from "../helper-functions/getUser"
// import { increment } from "firebase/firestore"
// import { Address } from "@ton/core"
// import { SuperPaymentWallet } from "../contracts/SuperPaymentWallet"
import { useEffect, useState } from "react"
import { useSyncInitialize } from "./useSyncInitialize"
// import { useAsyncInitialize } from "./useAsyncInitialize"

export function useSuperPayment() {
  const client = useTonClient()
  const { sender, txStatus, setTxStatus } = useTonConnect()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (txStatus == true) {
      setIsLoading(false)
      setTxStatus(null)
    }

    if (txStatus == false) {
      setIsLoading(false)
      setTxStatus(null)
    }
  }, [txStatus])

  const superPaymentFactory = useSyncInitialize(() => {
    if (!client) return
    return client.open(
      SuperPaymentFactory.createFromAddress(superPaymentFactoryAddress)
    )
  }, [client])

  const makePayment = async (amount: string) => {
    if (!client) return
    try {
      setIsLoading(true)
      // setPayAmount(amount)
      // setUserOpt(options)
      await superPaymentFactory?.sendDeposit(
        sender,
        toNano(amount) + toNano("0.03"),
        {
          depositAmount: toNano(amount),
        }
      )
      // checkPayment(amount, options)
    } catch (err) {
      console.log(err)
      setError("Error making payment")
    }
  }

  return {
    isLoading,
    error,
    deposit: (amount: string) => makePayment(amount),
  }
}
