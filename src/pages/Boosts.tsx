/* eslint-disable no-extra-semi */
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
  Icon,
} from "@chakra-ui/react"
import { TonConnectButton } from "@tonconnect/ui-react"
import WebApp from "@twa-dev/sdk"
import Navbar from "../components/Navbar"
import { useSuperPayment } from "../hooks/useSuperPayment"
import { useTonAddress } from "@tonconnect/ui-react"
import { IoIosCheckmarkCircle } from "react-icons/io"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import {
  getTaskQuerySnapshot,
  updateTaskVerifiedUsers,
} from "../helper-functions/getTasks"
import { DocumentData, increment } from "firebase/firestore"
import { updateUserData } from "../helper-functions/getUser"

export default function Boost({
  userId,
  name,
}: {
  userId: number | undefined
  name: string | null
}) {
  const { isLoading, deposit } = useSuperPayment()
  const address = useTonAddress(true)
  const [loadingTasks, setLoadingTasks] = useState(true)
  const handlePayment = async () => {
    if (!userId) return
    if (address == "") return
    try {
      await deposit("0.2")
    } catch (err) {
      console.log(err)
    }
  }

  // const handleTwitterFollow = () => {
  //   window.open("https://x.com/micromemecom/", "_blank")
  // }
  // const handleChannelJoin = () => {
  //   window.open("https://x.com/micromemecom/", "_blank")
  // }

  return (
    <>
      <Tabs
        bg={"#fff"}
        isFitted={true}
        variant={"enclosed"}
        colorScheme="white"
        transition={"all 3s"}
      >
        <TabList
          bgGradient="radial(blue.500, blue.700)"
          color={"#fff"}
          h={"65px"}
          roundedBottom={"20px"}
        >
          <Tab
            fontSize={"18px"}
            _selected={{
              bgGradient: "radial(blue.300, white)",
              roundedBottom: "20px",
              border: "none",
              fontSize: "20px",
            }}
          >
            Presale
          </Tab>
          <Tab
            fontSize={"18px"}
            _selected={{
              bgGradient: "radial(blue.300, white)",
              roundedBottom: "20px",
              border: "none",
              fontSize: "20px",
            }}
          >
            Tasks
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box color={"#000"} bg={"#fff"} minH={"100vh"} py={5}>
              <Flex justify={"end"} mt={"-20px"} mb={10}>
                <TonConnectButton className="my-button-class" />
              </Flex>

              <Box pb={"10px"} pt={"40px"} color={"#fff"}>
                <Box>
                  <Flex
                    justify={"space-between"}
                    align={"center"}
                    bgGradient="radial(blue.500, blue.700)"
                    rounded={"20px"}
                    p={3}
                    mb={2}
                  >
                    <HStack>
                      <Image
                        alt=""
                        w={"35px"}
                        h={"35px"}
                        src="/big_brain.png"
                      />
                      <Box>
                        <Text fontWeight={"bold"}>Increase Points</Text>
                        <HStack align={"center"} fontSize={"small"} mt={"-2px"}>
                          <Image alt="" src="/ton.png" w={"20px"} h={"20px"} />
                          <Text color={"yellow.400"} ml={"-5px"}>
                            0.2
                          </Text>
                        </HStack>
                      </Box>
                    </HStack>
                    <Text color={"yellow.400"}>+5000</Text>
                  </Flex>
                </Box>
              </Box>
              <Flex h={"10%"} justify={"center"} align={"center"} pb={"10px"}>
                <Button onClick={handlePayment} disabled={isLoading}>
                  {isLoading ? "Making payment..." : "Purchase $COM "}
                </Button>
              </Flex>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box color={"#000"} bg={"#fff"} minH={"100vh"} py={5}>
              <Box
                bgGradient="radial(blue.400, blue.600)"
                color={"white"}
                rounded={"8px"}
                px={6}
                mb={5}
                w={"fit-content"}
              >
                <Text as={"h3"} fontWeight={"bold"} fontSize={"17px"}>
                  Tasks
                </Text>
              </Box>

              {/* tasks */}
              <Tasks
                userId={userId}
                loadingTasks={loadingTasks}
                setLoadingTasks={setLoadingTasks}
              />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Navbar userId={userId} name={name} />
    </>
  )
}

type TasksProps = {
  userId: number | undefined
  loadingTasks: boolean
  setLoadingTasks: Dispatch<SetStateAction<boolean>>
}

function Tasks({ userId, loadingTasks, setLoadingTasks }: TasksProps) {
  const [allTasks, setAllTasks] = useState<DocumentData[]>([])
  useEffect(() => {
    const tasks = async () => {
      if (!userId) return
      try {
        const allTasksSnapshot = await getTaskQuerySnapshot()
        if (allTasksSnapshot == null) return
        setAllTasks(() => [])
        const docs = allTasksSnapshot.docs
        for (const doc of docs) {
          const data = doc.data()
          setAllTasks((curr) => [...curr, { ...data, id: doc.id }])
        }
        setLoadingTasks(false)
      } catch (err) {
        console.log("Error from Tasks useEffect", err)
      }
    }
    tasks()

    return () => {}
  }, [userId])
  if (!userId) return
  if (loadingTasks) {
    return (
      <Flex justify={"center"} align={"center"} bg={"#fff"} h={"100%"}>
        <Spinner color="gray.700" />
      </Flex>
    )
  }
  return (
    <Box>
      {allTasks.map((task) => (
        <Task
          key={task.id}
          userId={userId}
          title={task.title}
          reward={task.reward}
          externalUrl={task.externalUrl}
          imagePath={task.imagePath}
          type={task.type}
          documentId={task.id}
          checkedUsers={task.users}
        />
      ))}
    </Box>
  )
}

type TaskProp = {
  userId: number
  title: string
  reward: number
  externalUrl: string
  imagePath: string
  type: string
  documentId: string
  checkedUsers: number[]
}

function Task({
  userId,
  title,
  reward,
  externalUrl,
  imagePath,
  type,
  documentId,
  checkedUsers,
}: TaskProp) {
  const [taskVerified, setTaskVerified] = useState<boolean | null>(null)

  useEffect(() => {
    ;(() => {
      if (!userId) return
      setTaskVerified(checkedUsers.includes(userId) ? true : null)
    })()
  }, [userId, checkedUsers])

  const sleep = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time))

  const handleAction = async () => {
    if (!userId) return
    if (taskVerified) return
    setTaskVerified(false)

    await sleep(5000)
    // update db when verified
    await updateTaskVerifiedUsers(userId, documentId)
    await updateUserData(userId, { coinsEarned: increment(reward) })
    setTaskVerified(true)
  }

  return (
    <Box mt={"10px"} color={"#fff"}>
      <Box>
        <Flex
          justify={"space-between"}
          align={"center"}
          bgGradient="radial(blue.500, blue.700)"
          rounded={"20px"}
          p={3}
          mb={2}
          onClick={() => {
            if (type == "telegram") {
              WebApp.openTelegramLink(externalUrl)
            } else {
              WebApp.openLink(externalUrl, { try_instant_view: false })
            }
            handleAction()
          }}
          cursor={"pointer"}
          _hover={{ bgGradient: "radial(blue.400, blue.600)" }}
          transition={"background-color 0.3s ease"}
        >
          <HStack>
            <Image
              alt=""
              rounded={"full"}
              w={"35px"}
              h={"35px"}
              src={imagePath}
            />
            <Box>
              <Text fontWeight={"bold"}>{title}</Text>
              <Text
                color={"yellow.400"}
                mt={"-8px"}
                fontSize={"large"}
                fontWeight={"semibold"}
              >
                +{reward}
              </Text>
            </Box>
          </HStack>
          {taskVerified == false ? (
            <Spinner />
          ) : taskVerified == true ? (
            <Icon as={IoIosCheckmarkCircle} />
          ) : (
            ""
          )}
        </Flex>
      </Box>
    </Box>
  )
}
