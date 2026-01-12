import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD7y4LG1KyZJgmDJnOVLGWFWyRoD1IuUnk",
    authDomain: "parfumsozluk-aa1f3.firebaseapp.com",
    projectId: "parfumsozluk-aa1f3",
    storageBucket: "parfumsozluk-aa1f3.firebasestorage.app",
    messagingSenderId: "1013707911690",
    appId: "1:1013707911690:web:5cd9b656cd3cc52c4625f3",
    measurementId: "G-N9RRL421ZZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
