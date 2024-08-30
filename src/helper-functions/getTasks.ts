import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
} from "firebase/firestore"
import { app } from "../firebase/firebase"

const db = getFirestore(app)

async function getTaskQuerySnapshot() {
  try {
    const q = query(collection(db, "tasks"))
    const qs = await getDocs(q)
    return qs
  } catch (err) {
    console.log("Error from getTaskQuerySnapshot", err)
    return null
  }
}

async function updateTaskVerifiedUsers(userId: number, documentId: string) {
  const docRef = doc(db, "tasks", documentId)

  try {
    await updateDoc(docRef, {
      users: arrayUnion(userId),
    })
  } catch (err) {
    console.log("Error from updateTaskVerifiedUsers func", err)
  }
}

export { getTaskQuerySnapshot, updateTaskVerifiedUsers }
