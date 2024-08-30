import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  arrayUnion,
  FieldValue,
  increment,
  DocumentData,
} from "firebase/firestore"
import { app } from "../firebase/firebase"

const db = getFirestore(app)

export type User = {
  coinsEarned: number
  floatingTapEnergy: number
  lastUpdatedTime: FieldValue
  name: string
  referrals: number[]
  refillEnergy: number
  refillTime: number
  status: string
  tapEnergy: number
  tapPower: number
  userId: number
}

async function getAllusers() {
  const users: DocumentData[] = []
  const q = collection(db, "super")
  const qs = await getDocs(q)
  const docs = qs.docs
  for (const i of docs) {
    users.push(i.data())
  }
  return users
}

async function getQuerySnapshot(userId: number) {
  const q = query(collection(db, "super"), where("userId", "==", userId))
  const qs = await getDocs(q)
  return qs
}

async function getUserData(userId: number, name: string, referralId?: number) {
  try {
    console.log(userId)
    const qs = await getQuerySnapshot(userId)
    if (qs.empty) {
      await createUser(userId, name) // create the user if the user does not exist
      const qs = await getQuerySnapshot(userId)
      const data = qs.docs[0].data()
      if (referralId && referralId != userId) {
        await updateReferralData(userId, referralId)
      }
      return data
    }
    const data = qs.docs[0].data()
    // console.log(data)
    return data
  } catch (err) {
    console.log(err)
    return null
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
async function updateUserData(userId: number, updates: {}) {
  const qs = await getQuerySnapshot(userId)
  if (qs.empty) {
    console.log("No user found with that ID.")
    return null // Or throw an error if preferred
  }
  const docRef = doc(db, "super", qs.docs[0].id)
  await updateDoc(docRef, { ...updates })
}

async function createUser(userId: number, name: string) {
  const docRef = await addDoc(collection(db, "super"), {
    coinsEarned: 1000,
    floatingTapEnergy: 1000,
    lastUpdatedTime: Date.now() / 1000,
    name,
    referrals: [],
    refillEnergy: 1,
    refillTime: 10,
    status: "active",
    tapEnergy: 1000,
    tapPower: 999,
    userId: userId,
  })
  console.log("Document written with ID: ", docRef.id)
}

async function updateReferralData(userId: number, referralId: number) {
  try {
    const qs = await getQuerySnapshot(referralId)
    if (qs.empty) {
      console.log("No user found with that ID.")
      return null // Or throw an error if preferred
    }
    const docRef = doc(db, "super", qs.docs[0].id)
    await updateDoc(docRef, {
      coinsEarned: increment(3000),
      referrals: arrayUnion(userId),
    })
  } catch (err) {
    console.log(err)
  }
}

export { getUserData, updateUserData, getQuerySnapshot, getAllusers }
