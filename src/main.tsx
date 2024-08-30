import ReactDOM from "react-dom/client"
import { ChakraProvider } from "@chakra-ui/react"
import { TonConnectUIProvider } from "@tonconnect/ui-react"
import App from "./App"
import "./index.css"
import React from "react"
import theme from "./theme/theme"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <TonConnectUIProvider manifestUrl="https://rose-gothic-goose-655.mypinata.cloud/ipfs/QmPDEh6qUyb67aCpox7T2anjBQjNyyVRCEbnQ4NHHXDkoi">
        <App />
      </TonConnectUIProvider>
    </ChakraProvider>
  </React.StrictMode>
)
