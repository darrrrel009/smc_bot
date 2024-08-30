import {
  Box,
  Flex,
  HStack,
  Image,
  Progress,
  Text,
  Spinner,
} from "@chakra-ui/react"
import Navbar from "../components/Navbar"
// core version + navigation, pagination modules:
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
// import Swiper and modules styles
import "swiper/css"
import "swiper/css/navigation"

import "../swiper.css"
import { useEffect, useState } from "react"
import { getAllusers } from "../helper-functions/getUser"
import { DocumentData } from "firebase/firestore"
import { levelNames, levelMinPoints } from "../helper-functions/constants"
// const referralData = [
//   {
//     name: "Phenomenal",
//     status: "silver",
//     coinsEarned: 12121,
//     position: "2",
//   },
//   {
//     name: "Knowledge",
//     status: "gold",
//     coinsEarned: 32323,
//     position: "1",
//   },
// ]

const bgColors = [
  "radial(rgba(84,51,16, 0.2),rgba(84,51,16,0.3),rgba(84,51,16, 0))",
  "radial(rgba(104, 109, 118, 0.2),rgba(104, 109, 118, 0.3),rgba(104, 109, 118,0))",
  "radial(rgba(249, 228, 0,0.2),rgba(249, 228, 0,0.3),rgba(249, 228, 0,0))",
  "radial(rgba(104, 109, 118, 0.2),rgba(104, 109, 118, 0.3),rgba(104, 109, 118,0))",
  "radial(rgba(0, 0, 255, 0.2),rgba(0, 0, 255, 0.3),rgba(0, 0, 255, 0))",
  "radial(rgba(255,0,255, 0.2),rgba(255, 0, 255, 0.3),rgba(255, 0, 255, 0))",
  "radial(rgba(0, 255, 255, 0.2),rgba(0, 255, 255, 0.3),rgba(0, 255, 255, 0))",
  "radial(rgba(65, 176, 110,0.2),rgba(65, 176, 110,0.3),rgba(65, 176, 110,0))",
  "radial(rgba(89, 116, 69,0.2),rgba(89, 116, 69,0.3),rgba(89, 116, 69,0))",
  "radial(rgba(100, 153, 233,0.2),rgba(100, 153, 233,0.3),rgba(100, 153, 233,0))",
  "radial(rgba(160, 222, 255,0.2),rgba(160, 222, 255,0.3),rgba(160, 222, 255,0))",
]

function sortData(usersData: DocumentData[]) {
  const newData = [...usersData]
  newData.sort((a, b) => b.coinsEarned - a.coinsEarned)
  console.log(usersData)
  return newData
}

export default function LeaderBoard({
  userId,
  name,
}: {
  userId: number | undefined
  name: string | null
}) {
  const [bgColor, setBgColor] = useState(
    "radial(rgba(84,51,16, 0.2),rgba(84,51,16,0.3),rgba(84,51,16, 0))"
  )
  const [minPoints, setMinPoints] = useState(0)
  const [userData, setUserData] = useState<DocumentData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  function handleSliderEvent(activeSlide: number) {
    setBgColor(bgColors[activeSlide])
    setMinPoints(levelMinPoints[activeSlide])
  }
  useEffect(() => {
    async function users() {
      try {
        const usersData = await getAllusers()
        setUserData(usersData)
        setIsLoading(false)
      } catch (err) {
        console.log(err)
      }
    }
    users()
  }, [])

  return (
    <Box minH={"100%"}>
      <Box h={"280px"} color={"#fff"} bgGradient={bgColor}>
        <Swiper
          onSlideChange={(e) => handleSliderEvent(e.activeIndex)}
          navigation={true}
          modules={[Navigation]}
          className="mySwiper"
        >
          {levelNames.map((level) => (
            <SwiperSlide key={level}>
              <Box
                bgGradient={
                  "radial(rgba(225,225, 225, 0),rgba(225,225, 225, 0.05),rgba(225,225, 225, 0))"
                }
                h={"100px"}
                w={"120px"}
                px={3}
                py={5}
                rounded={"10px"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                {level}
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
        <Box px={3} mt={"-30px"} textAlign={"center"}>
          <Text mb={1}>from {minPoints.toLocaleString()}</Text>
          <Progress rounded={"20px"} bg={"rgba(160, 222, 255,0.5)"} />
        </Box>
      </Box>

      <Box px={3} mt={10} mb={"100px"} bg={"#fff"} pt={5}>
        {isLoading ? (
          <Flex justify={"center"}>
            <Spinner color="gray.500" />
          </Flex>
        ) : (
          sortData(userData).map((data) => (
            <Flex
              justify={"space-between"}
              align={"center"}
              bgGradient="radial(blue.500, blue.700)"
              rounded={"20px"}
              p={3}
              mb={2}
              key={data.name}
              color={"#fff"}
            >
              <HStack>
                <Image alt="" w={"30px"} h={"30px"} src="/big_brain.png" />
                <Box>
                  <Text fontWeight={"bold"}>{data.name}</Text>
                  <HStack align={"center"} fontSize={"small"} mt={"-2px"}>
                    {/* <Text>{data.status} </Text> */}
                    {/* <Icon as={GoDotFill} /> */}
                    <Image alt="" src="/coin.png" w={"20px"} h={"20px"} />
                    <Text color={"yellow.400"} ml={"-5px"}>
                      {Math.round(data.coinsEarned)}
                    </Text>
                  </HStack>
                </Box>
              </HStack>
              <Text color={"gray.500"} fontSize={20}>
                {data.position}
              </Text>
            </Flex>
          ))
        )}
      </Box>

      <Navbar userId={userId} name={name} />
    </Box>
  )
}
