import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDhG1wOZDLve_NqO1yqu5rMOjkaL0nr_rs",
  authDomain: "chat-pa-a5af1.firebaseapp.com",
  projectId: "chat-pa-a5af1",
  storageBucket: "chat-pa-a5af1.appspot.com",
  messagingSenderId: "324193833158",
  appId: "1:324193833158:web:b9bedd3aa43f8d13dc07c7",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
