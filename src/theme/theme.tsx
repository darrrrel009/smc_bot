// src/theme/index.js or src/theme.js
import { extendTheme } from "@chakra-ui/react"
import "../../node_modules/@fontsource/vt323"

const theme = extendTheme({
  fonts: {
    heading: `'VT323', system-ui`,
    body: `'VT323', system-ui`,
  },
})

export default theme
