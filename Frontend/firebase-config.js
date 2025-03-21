// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCg0Z6Z_vfmi63mCSUbUJrEyarh7phwiXE",
    authDomain: "aushadhivan-90dd7.firebaseapp.com",
    projectId: "aushadhivan-90dd7",
    storageBucket: "aushadhivan-90dd7.appspot.com",
    messagingSenderId: "863901232275",
    appId: "1:863901232275:web:81bae0dbe1a2d18bbf7166"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Function to fetch all plants from Firestore
export async function fetchPlants() {
    try {
        const plantsRef = collection(db, "plants");
        const querySnapshot = await getDocs(plantsRef);
        return querySnapshot.docs.map(doc => doc.data()); // Returns an array of plant objects
    } catch (error) {
        console.error("Error fetching plants:", error);
        return [];
    }
}

// Function to search plants by Name or Diseases
export async function searchPlants(searchTerm) {
    try {
        const plantsRef = collection(db, "plants");
        const querySnapshot = await getDocs(plantsRef); // Fetch all documents

        const filteredPlants = querySnapshot.docs
            .map(doc => doc.data()) // Convert snapshot to array
            .filter(plant => {
                const name = plant.name ? plant.name.toLowerCase() : ""; // Ensure it's a string
                const diseases = plant.diseases ? plant.diseases.toLowerCase() : ""; // Ensure it's a string
                return name.includes(searchTerm.toLowerCase()) || diseases.includes(searchTerm.toLowerCase());
            });

        return filteredPlants;
    } catch (error) {
        console.error("Error searching plants:", error);
        return [];
    }
}

// Export authentication and database functionalities
export { auth, provider, createUserWithEmailAndPassword, signInWithEmailAndPassword, db };