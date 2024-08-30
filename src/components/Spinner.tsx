// import Image from "next/image";
import gif from "/meme_logo.png"
import ton from "/ton.png"
import { Typewriter } from "react-simple-typewriter"

// import { Flex, Box, Text } from "@chakra-ui/react"
// import { ClipLoader } from "react-spinners"

function Spinner() {
  return (
    <>
      <div className="preloader flex-col grand-font relative z-10 w-full">
        <div className="glow"></div>
        <div className="mb-6 text-yellow meme_intro">
          Super Meme <br />
          <div>
            <Typewriter
              words={["Computers"]}
              loop={true}
              cursor
              cursorStyle="_"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </div>
        </div>
        <div className="preloader_main">
          <div className="bouncingImage">
            <img src={gif} className="w-48" alt="gif" />
          </div>
        </div>

        <div className="flex justify-center items-center flex-col mt-16 w-full">
          <p className="p-0 m-0">Powered by </p>
          <div className="flex justify-center items-center gap-2">
            <img src={ton} alt="ton" className="w-8" />
            <h1 className="font-bold"> TON </h1>
          </div>
        </div>
      </div>
      <footer className="bg-white text-gray-400 text-sm py-4 text-center w-full fixed bottom-0 relative z-10">
        <p className="text-white grand-font">
          &copy; Copyright {new Date().getFullYear()} Super Meme Computers.
        </p>
      </footer>
      <div className="background-image"></div>
    </>
  )
}

export default Spinner
