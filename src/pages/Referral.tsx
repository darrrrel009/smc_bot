import {
  Box,
  Flex,
  HStack,
  Icon,
  Image,
  Text,
  Spinner,
  useToast,
} from "@chakra-ui/react"
import Navbar from "../components/Navbar"
import { getQuerySnapshot } from "../helper-functions/getUser"
import { useEffect, useState } from "react"
import { DocumentData } from "firebase/firestore"
import { FaRegCopy } from "react-icons/fa6"
import { useUserData } from "../hooks/useUserData"
// import Spinner from "../components/Spinner";

// const referralData = [
//   {
//     name: "Phenomenal",
//     status: "silver",
//     coinsEarned: 12121,
//     referralEarnings: "3",
//   },
//   {
//     name: "Knowledge",
//     status: "gold",
//     coinsEarned: 32323,
//     referralEarnings: "3",
//   },
// ]

async function getRef(userId: number | undefined) {
  if (!userId) return
  const qs = await getQuerySnapshot(userId)
  if (qs.empty) {
    console.log("User does not exist")
    return
  }
  const data = qs.docs[0].data()
  return data
}

function Referral({
  userId,
  name,
}: {
  userId: number | undefined
  name: string | null
}) {
  const { isLoading, userData } = useUserData(userId, name)
  const [referredUsers, setReferredUsers] = useState<DocumentData[]>()
  const toast = useToast() // Initialize the useToast hook

  useEffect(() => {
    async function getReferredUsers() {
      setReferredUsers(() => [])
      if (!userData) return
      const qs = await getQuerySnapshot(Number(userData.userId))
      if (qs.empty) {
        console.log("User does not exist")
        return
      }
      const data = qs.docs[0].data()
      const referrals = data.referrals

      referrals.forEach(async (refId: number) => {
        const data = await getRef(refId)
        if (data) {
          setReferredUsers((ref) => {
            if (ref) {
              return [...ref, data]
            }
            return [data]
          })
        }
      })
    }

    getReferredUsers()

    return () => {}
  }, [userData])

  function handleCopy() {
    try {
      navigator.clipboard.writeText(
        `https://t.me/super_mvp_bot/?start=${userId}`
      )
      toast({
        title: "Invite link has been copied !!!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      })
    } catch (err) {
      console.log(err)
    }
  }

  return userData == undefined ? (
    <Flex justify={"center"} align={"center"} bg={"#fff"} minH={"100vh"}>
      <Spinner color="gray.700" />
    </Flex>
  ) : (
    <Flex minH={"100%"} justify="center" align="center">
      <Box
        width={["100%", "360px"]}
        minH={"100vh"}
        bg={"#fff"}
        position={"relative"}
        px={5}
        py={8}
        color={"black"}
      >
        <Box color={"black"}>
          <Box textAlign={"center"}>
            <Text as="h2" fontSize={"30px"} fontWeight={"bold"}>
              Invite Friends
            </Text>
            <Text as="p" fontSize={"small"} fontStyle={"italic"}>
              You and your friend will receive bonuses
            </Text>
          </Box>
        </Box>
        <Box mt={8}>
          <HStack
            bgGradient="radial(blue.500, blue.700)"
            rounded={"20px"}
            p={3}
            color={"white"}
          >
            <Image alt="" w={"60px"} h={"60px"} src="/giftbox.png" />
            <Box>
              <Text fontWeight={"bold"}>Invite a friend</Text>
              <HStack color={"yellow.400"} fontSize={"small"}>
                <Image alt="" src="/coin.png" w={"20px"} h={"20px"} />
                <Text ml={"-2px"}>
                  +3000{" "}
                  <Text as={"span"} color={"white"}>
                    for you and your friend
                  </Text>
                </Text>
              </HStack>
            </Box>
          </HStack>

          <Flex justify={"space-between"} gap={2} mt={"10px"}>
            <Box
              rounded={"15px"}
              p={3}
              bgGradient="radial(blue.500, blue.700)"
              textAlign={"center"}
              fontWeight={"bold"}
              w={"100%"}
              color={"white"}
            >
              <Text>Invite a friend</Text>
            </Box>
            <Box
              w={"60px"}
              bgGradient="radial(blue.500, blue.700)"
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              rounded={"15px"}
              cursor={"pointer"}
              onClick={handleCopy}
              _hover={{ width: "70px" }}
              transition={"width 0.5s ease"}
              color={"white"}
            >
              <Icon as={FaRegCopy} />
            </Box>
          </Flex>
        </Box>

        <Box mt={"65px"} pb={"120px"}>
          <Box
            bgGradient="radial(blue.400, blue.600)"
            color={"white"}
            rounded={"8px"}
            px={3}
            w={"fit-content"}
          >
            <Text as={"h3"} fontWeight={"bold"} fontSize={"17px"}>
              Friend List ({referredUsers?.length})
            </Text>
          </Box>
          <Box mt={4} color={"white"}>
            {isLoading || !referredUsers ? (
              <Flex justify={"center"} align={"center"}>
                <Spinner color="gray.700" />
              </Flex>
            ) : (
              referredUsers.map((data) => (
                <Flex
                  justify={"space-between"}
                  align={"center"}
                  bgGradient="radial(blue.500, blue.700)"
                  rounded={"20px"}
                  p={3}
                  mb={2}
                  key={data.name}
                >
                  <HStack>
                    <Image alt="" w={"30px"} h={"30px"} src="/big_brain.png" />
                    <Box>
                      <Text fontWeight={"bold"}>{data.name}</Text>
                      <HStack align={"center"} fontSize={"small"} mt={"-2px"}>
                        <Image alt="" src="/coin.png" w={"20px"} h={"20px"} />
                        <Text color={"yellow.400"} ml={"-5px"}>
                          {Math.round(data.coinsEarned)}
                        </Text>
                      </HStack>
                    </Box>
                  </HStack>
                  <Text color={"yellow.400"}>+{3}k</Text>
                </Flex>
              ))
            )}
          </Box>
        </Box>
        <Navbar userId={userData.userId} name={name ? name : ""} />
      </Box>
    </Flex>
  )
}

export default Referral
