import { initializeApp } from "firebase/app";
import getEnv from "../utils/get-env";

const firebaseConfig = JSON.parse(getEnv("FIREBASE_CONFIG"));

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
