// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCu_x5u41A8Jt4aNyKsjFznuOXBJEX3ULg",
  authDomain: "image-upload-cd092.firebaseapp.com",
  projectId: "image-upload-cd092",
  storageBucket: "image-upload-cd092.appspot.com",
  messagingSenderId: "61663945463",
  appId: "1:61663945463:web:32eda710745364d59129f2",
  measurementId: "G-E0ER5QRPNX"
};
const firebaseApp = initializeApp(firebaseConfig);
const imageDb = getStorage(firebaseApp);
const analytics = getAnalytics(firebaseApp); // Fix: pass firebaseApp as an argument to getAnalytics
export { imageDb };
