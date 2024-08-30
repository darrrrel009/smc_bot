// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABCjVpdIfiAfRCXrFplEPT8dPPE6PwvqQ",
  authDomain: "supermemecomp.firebaseapp.com",
  projectId: "supermemecomp",
  storageBucket: "supermemecomp.appspot.com",
  messagingSenderId: "836914421915",
  appId: "1:836914421915:web:804926969c85290a41663e",
  measurementId: "G-9LLYCSETQE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);