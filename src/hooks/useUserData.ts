import { useEffect, useState } from "react"
import { getUserData } from "../helper-functions/getUser"
import { DocumentData } from "firebase/firestore"

function useUserData(
  userId: number | undefined,
  firstName: string | null,
  referralId?: number
) {
  const [userData, setUserData] = useState<DocumentData>()
  const [isLoading, setIsLoading] = useState(true)
  const [name, setName] = useState<string | null>(null)

  useEffect(() => {
    // Only fetch user data if userId and firstName are available
    if (userId && firstName) {
      const fetchUserData = async () => {
        try {
          const data = await getUserData(userId, firstName, referralId)
          if (data) {
            setUserData(data)
            setName(firstName)
          }
        } catch (error) {
          console.log("useUserData error:", error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchUserData()
    } else {
      setIsLoading(false) // No need to load if no userId or firstName
    }
  }, [userId, firstName, referralId])

  return { isLoading, userData, name }
}

export { useUserData }
