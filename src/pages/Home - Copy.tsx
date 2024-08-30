import { useEffect, useState } from "react"
import { Flex, Box, Image, Text, Progress, Icon } from "@chakra-ui/react"
import { keyframes } from "@emotion/react"
import Spinner from "../components/Spinner"
// import WebApp from "@twa-dev/sdk"

import Navbar from "../components/Navbar"
import { useUserData } from "../hooks/useUserData"
import { updateUserData } from "../helper-functions/getUser"
// import { FaUser } from "react-icons/fa6"
import { FcFlashOn } from "react-icons/fc"
import { Link, useSearchParams } from "react-router-dom"
import { IoIosArrowForward } from "react-icons/io"
import { TfiCup } from "react-icons/tfi"
import { levelNames, levelMinPoints } from "../helper-functions/constants"

const floatUpAndFadeOut = keyframes
  0% {
    transform: translateY(0px);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px);
    opacity: 0;
  }


const rotateCoinLeft = keyframes
  0% {
    transform: rotateY(0deg)
  }
  100% {
    transform: rotateY(20deg)
  }


const rotateCoinRight = keyframes
  0% {
    transform: rotateY(0deg)
  }
  100% {
    transform: rotateY(-20deg)
  }

function Home({
  userId,
  name,
}: {
  userId: number | undefined
  name: string | null
}) {
  const [floatingEnergy, setFloatingEnergy] = useState(0)
  const [coinsEarned, setCoinsEarned] = useState(0)
  const [tappingEnergy, setTappingEnergy] = useState(0)
  const [tappingPower, setTappingPower] = useState(0)
  const [params] = useSearchParams()
  const [rotateAnim, setRotateAnim] = useState("")
  const [userStatus, setUserStatus] = useState("Loading...")
  // const userId = Number(params.get("userId"))
  const referralId = Number(params.get("referralId"))
  // const firstName = params.get("name")

  const { userData } = useUserData(userId, name, referralId)

  const [screenAxis, setScreenAxis] = useState<
    { x: number; y: number; id: number }[]
  >([])

  useEffect(() => {
    const pointsList: number[] = []
    if (coinsEarned > levelMinPoints[levelMinPoints.length - 1]) {
      setUserStatus("Creator")
      return
    }
    function getStatus() {
      for (const i of levelMinPoints) {
        if (coinsEarned > i) {
          pointsList.push(i)
        }
      }
    }
    getStatus()
    const lastEl = pointsList[pointsList.length - 1]
    const index = levelMinPoints.indexOf(lastEl)
    const status = levelNames[index]
    setUserStatus(status)

    return () => { }
  }, [coinsEarned])

  const handleTap = async (clientX: number, clientY: number) => {
    if (!userId) return
    if (floatingEnergy - tappingPower <= 0) return

    setFloatingEnergy((curr) => curr - tappingPower)
    setCoinsEarned((coins) => coins + tappingPower)
    setScreenAxis((prv) => [...prv, { x: clientX, y: clientY, id: Date.now() }])
    if (clientX < 170) {
      setRotateAnim(() => rotateCoinLeft)
    } else if (clientX > 230) {
      setRotateAnim(() => rotateCoinRight)
    }

    // update coins in db
    // const userId = userData.userId
    await updateUserData(userId, {
      coinsEarned: coinsEarned + tappingPower,
      floatingTapEnergy: floatingEnergy - tappingPower,
    })
  }

  const removeScreen = (id: number) => {
    setScreenAxis(screenAxis.filter((screen) => screen.id !== id))
  }

  useEffect(() => {
    if (!userData) return
    const timeLost = calculateLostTime()
    setCoinsEarned(() => userData.coinsEarned)
    setTappingEnergy(() => userData.tapEnergy)
    const energyPerSec = userData.refillEnergy / userData.refillTime
    const energyLost: number =
      userData.floatingTapEnergy + energyPerSec * timeLost
    if (timeLost >= 3) {
      if (Number(energyLost.toFixed(0)) >= userData.tapEnergy) {
        setFloatingEnergy(() => userData.tapEnergy)
      } else {
        setFloatingEnergy(() => Number(energyLost.toFixed(0)))
      }
    } else {
      setFloatingEnergy(() => userData.floatingTapEnergy)
    }
    //setFloatingEnergy(() => userData.floatingTapEnergy)
    // setRefillEnergy(userData.refilEnergy)
    setTappingPower(() => userData.tapPower)
    // setUserId(userData.userId)
    return () => { }
  }, [userData])

  useEffect(() => {
    if (!userData) return
    setInterval(() => {
      setFloatingEnergy((curr) => {
        if (curr + userData.refillEnergy >= userData.tapEnergy)
          return userData.tapEnergy
        return curr + userData.refillEnergy
      })
    }, 3000)
    return () => { }
  }, [userData])

  useEffect(() => {
    if (!userId) return
      ; (async () => {
        await updateUserData(userId, {
          floatingTapEnergy: floatingEnergy,
          lastUpdatedTime: Date.now() / 1000,
        })
      })()
    return () => { }
  }, [floatingEnergy, userId])

  const calculateLostTime = (): number => {
    const lastUpdate = userData?.lastUpdatedTime
    const timeNowInSeconds = Date.now() / 1000
    return timeNowInSeconds - lastUpdate
  }

  return !userData ? (
    // return (
    <Flex minH="100vh" justify="center" overflow={"hidden"} align="center">
      <Spinner />
    </Flex>
  ) : (
    <Flex
      height="100vh"
      justify="center"
      overflow={"hidden"}
      align="center"
      bg={"white"}
    >
      <Box
        width={["100%", "360px"]}
        height="100%"
        bgGradient="radial(blue.600, blue.400, blue.700)"
      >
        {/* <Box
          p={5}
          fontWeight="bold"
          color="white"
          className="intro_img"
          h={"10%"}
          bgImage="url('/comp-hero.png')" // Replace with your image path
          bgSize="cover"
          bgPos="center"
          bgRepeat="no-repeat"
        >
        
        </Box> */}

        <Box
          bg="radial-gradient(circle, #26414b, #1c2536)"
          h={"90%"}
          roundedTop={"0px"}
          px={5}
          py={8}
          // mt={8}
          pos={"relative"}
        >
          <Flex align={"center"} justify={"center"} gap={2}>
            <Image alt="coin" src="/big_brain2.png" w={"30px"} h={"30px"} />
            <Text color={"white"} fontSize={"6vh"}>
              {coinsEarned.toLocaleString()}
            </Text>
          </Flex>

          <Flex justify={"center"} align={"center"}>
            <Link to={"leaderboard"}>
              <Flex color={"#000"} justify={"center"} align={"center"} mt={3}>
                <Icon as={TfiCup} mr={2} fontSize={"25px"} color={"white"} />
                <Text fontSize={"30px"} color={"white"}>
                  {userStatus}
                </Text>
                <Icon as={IoIosArrowForward} />
              </Flex>
            </Link>
          </Flex>

          <Flex align={"center"} justify={"center"} mt={"30px"} px={5}>
            <Box
              bgGradient="#ffff"
              h={"43vh"}
              w={"100%"} 
              rounded={"full"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              position={"relative"}
              onTouchStart={async (e) =>
                await handleTap(e.touches[0].clientX, e.touches[0].clientY)
              }
              animation={${rotateAnim} 0.1s ease }
              onAnimationEnd={() => setRotateAnim("")}
            >
              <Box
                bg={"#ffffff00"}
                rounded={"full"}
                h={"100%"}
                w={"100%"}
                pos={"absolute"}
                zIndex={"10"}>
                
              </Box>
              <Image alt="" src="/main.png" />
              <Box
                bgGradient="#ffffff00"
                h={"90%"}
                w={"90%"}
                rounded={"full"}
              >
                
              </Box>
            </Box>
          </Flex>
        </Box>

        {screenAxis.map((screen) => (
          <Text
            key={screen.id}
            position={"absolute"}
            left={${screen.x - 10}px}
            top={${screen.y}px}
            color={"blue.800"}
            as={"p"}
            animation={${floatUpAndFadeOut} 1s ease forwards}
            onAnimationEnd={() => removeScreen(screen.id)}
            zIndex={"5"}
            fontSize={"50px"}
          >
            +{tappingPower}
          </Text>
        ))}

        <Flex justify={"center"}>
          <Box
            borderTopLeftRadius={"20"}
            borderTopRightRadius={"20"}
            pos={"fixed"}
            display={"flex"}
            justifyContent={"center"}
            bg={"black"}
            bottom={"8vh"}
            h={"135px"}
            w={["100%", "320px"]}
            // overflowY={"hidden"}
            mb={3}
          >
            <Box w={["90%", "100%"]}
            
            >
              <Flex justify={"center"} align={"center"}
              position={"relative"}
              top={"-10vh"}
              fontSize={"larger"} // Or you can use a specific value like "18px"
              width={"44%"}
              textAlign={"center"}
              backgroundColor={"#465a677a"}
              borderRadius={"8px"}
              left={"25vw"}
              height={"4vh"}>
                <Icon boxSize={6} mr={"-4px"} as={FcFlashOn} />
                <Text fontWeight={"bold"} fontSize={"18px"} color={"white"}>
                  {floatingEnergy}/
                  <Text as={"span"} fontSize={"18px"}>
                    {tappingEnergy}
                  </Text>
                </Text>
              </Flex>
             
              <Progress
                rounded={"10px"}
                h={"7vh"}
                bg={"#233844"}
                value={(floatingEnergy / tappingEnergy) * 100}
                min={0}
              />
              <Flex
      justify={"center"}
      align={"center"}
      position={"absolute"}
      top={0}
      left={0}
      right={0}
      bottom={0}
      fontSize={"18px"}
      color={"white"}
    >
      Claim
    </Flex>
               {/* <Text fontWeight={"bold"} fontSize={"18px"} color={"white"}>Claim</Text> */}
            </Box>
          </Box>
        </Flex>

        <Navbar userId={999} name={name ? name : ""} />
      </Box>
    </Flex>
  )
}
export default Home