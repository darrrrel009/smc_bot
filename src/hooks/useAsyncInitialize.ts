/* eslint-disable no-extra-semi */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"

export function useAsyncInitialize<T>(
  callback: () => Promise<T>,
  deps: any[] = []
) {
  const [state, setState] = useState<T | undefined>()

  useEffect(() => {
    ;(async () => {
      setState(await callback())
    })()

    return () => {}
  }, deps)

  return state
}
