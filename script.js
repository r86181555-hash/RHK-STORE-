// ==========================
// Firebase Imports
// ==========================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


// ==========================
// Firebase Config
// ==========================
const firebaseConfig = {
    apiKey: "AIzaSyAHUju18VBAdDFoQJhsVWp7oUqBxhfwThE",
    authDomain: "rhk-app-e34c6.firebaseapp.com",
    projectId: "rhk-app-e34c6",
    storageBucket: "rhk-app-e34c6.firebasestorage.app",
    messagingSenderId: "1016565109006",
    appId: "1:1016565109006:web:eb7ec260a601a16e5ac75f",
    measurementId: "G-814PTRRQVQ"
};


// ==========================
// Initialize Firebase
// ==========================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// ==========================
// HTML Elements
// ==========================
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const loginBtn = document.getElementById("loginBtn");
const forgotPassword = document.getElementById("forgotPassword");
const createAccount = document.getElementById("createAccount");


// ==========================
// Login
// ==========================
loginBtn.addEventListener("click", async () => {

    let loginValue = emailInput.value.trim().toLowerCase();
    let password = passwordInput.value.trim();

    if (loginValue === "" || password === "") {
        alert("Please fill all fields.");
        return;
    }

    try {

        let email = loginValue;

        // If user entered username instead of email
        if (!loginValue.includes("@")) {

            const usernameDoc =
                await getDoc(doc(db, "usernames", loginValue));

            if (!usernameDoc.exists()) {
                alert("Username not found.");
                return;
            }

            email = usernameDoc.data().email;
        }

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        alert("Welcome to RHK!");

        window.location.href = "home.html";

    } catch (error) {

        alert(error.message);

    }

});


// ==========================
// Forgot Password
// ==========================
forgotPassword.addEventListener("click", async (e) => {

    e.preventDefault();

    let loginValue = emailInput.value.trim().toLowerCase();

    if (loginValue === "") {
        alert("Enter your email.");
        return;
    }

    try {

        if (!loginValue.includes("@")) {

            const usernameDoc =
                await getDoc(doc(db, "usernames", loginValue));

            if (!usernameDoc.exists()) {
                alert("Username not found.");
                return;
            }

            loginValue = usernameDoc.data().email;
        }

        await sendPasswordResetEmail(auth, loginValue);

        alert("Password reset email sent.");

    } catch (error) {

        alert(error.message);

    }

});


// ==========================
// Create Account
// ==========================
createAccount.addEventListener("click", () => {

    window.location.href = "signup.html";

});


// ==========================
// Auto Login
// ==========================
onAuthStateChanged(auth, (user) => {

    if (user) {

        window.location.href = "home.html";

    }

});
