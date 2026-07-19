// =========================
// Firebase Imports
// =========================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


// =========================
// Firebase Config
// =========================
const firebaseConfig = {
    apiKey: "AIzaSyAHUju18VBAdDFoQJhsVWp7oUqBxhfwThE",
    authDomain: "rhk-app-e34c6.firebaseapp.com",
    projectId: "rhk-app-e34c6",
    storageBucket: "rhk-app-e34c6.firebasestorage.app",
    messagingSenderId: "1016565109006",
    appId: "1:1016565109006:web:eb7ec260a601a16e5ac75f",
    measurementId: "G-814PTRRQVQ"
};


// =========================
// Initialize Firebase
// =========================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// =========================
// HTML Elements
// =========================
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const signupBtn = document.getElementById("signupBtn");


// =========================
// Create Account
// =========================
signupBtn.addEventListener("click", async () => {

    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if (
        usernameValue === "" ||
        emailValue === "" ||
        passwordValue === ""
    ) {
        alert("Please fill all fields.");
        return;
    }

    if (passwordValue.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }

    try {

        // Create Firebase Authentication account
        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                emailValue,
                passwordValue
            );

        const user = userCredential.user;

        // Save user profile
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            username: usernameValue.toLowerCase(),
            email: emailValue,
            createdAt: new Date()
        });

        // Username lookup document
        await setDoc(doc(db, "usernames", usernameValue.toLowerCase()), {
            email: emailValue,
            uid: user.uid
        });

        alert("Account Created Successfully!");

        window.location.href = "home.html";

    } catch (error) {

        alert(error.message);

    }

});
