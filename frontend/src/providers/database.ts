import firebaseApp from "./firebaseApp";
import { getFirestore } from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default db;