import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Referral from "./pages/Referral"
import { useUserData } from "./hooks/useUserData"
import Spinner from "./components/Spinner"
import { ContextProvdider } from "./context/ContextProvider"
import WebApp from "@twa-dev/sdk"
import { useEffect, useState } from "react"
import Boost from "./pages/Boosts"
import LeaderBoard from "./pages/LeaderBoard"

function App() {
  const [userId, setUserId] = useState<number | undefined>()
  const [firstName, setFirstName] = useState<string | null>(null)
  const [showSpinner, setShowSpinner] = useState(true)
  const params = new URLSearchParams(location.search)
  const referralId = Number(params.get("referralId"))

  // Mock data for local development
  const isLocal = !window.TelegramWebApp; // Adjust this condition as necessary

  useEffect(() => {
    if (isLocal) {
      // Provide mock user data for local development
      setUserId(129); // Mock user ID
      setFirstName("John Doe"); // Mock user name
    } else if (WebApp) {
      WebApp.expand()
      const id = WebApp.initDataUnsafe.user?.id
      const name = WebApp.initDataUnsafe.user?.first_name || null
      if (id || name) {
        setUserId(id)
        setFirstName(name)
      }
    }
  }, [isLocal])

  const { isLoading, name } = useUserData(userId, firstName, referralId)

  useEffect(() => {
    // Ensure spinner is shown for a minimum duration
    const timer = setTimeout(() => {
      setShowSpinner(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading || showSpinner) {
    return <Spinner />
  }

  return (
    <ContextProvdider
      userId={userId}
      firstName={firstName}
      referralId={referralId}
    >
      <BrowserRouter>
        <Routes>
          <Route index element={<Home userId={userId} name={name} />} />
          <Route
            path="/referral"
            element={<Referral userId={userId} name={name} />}
          />
          <Route
            path="/boost"
            element={<Boost userId={userId} name={name} />}
          />
          <Route
            path="/leaderboard"
            element={<LeaderBoard userId={userId} name={name} />}
          />
        </Routes>
      </BrowserRouter>
    </ContextProvdider>
  )
}

export default App
