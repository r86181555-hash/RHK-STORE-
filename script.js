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


// ==========================
// Your Firebase Config
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


// ==========================
// HTML Elements
// ==========================
const email = document.getElementById("email");
const password = document.getElementById("password");

const loginBtn = document.getElementById("loginBtn");
const forgotPassword = document.getElementById("forgotPassword");
const createAccount = document.getElementById("createAccount");


// ==========================
// Login
// ==========================
loginBtn.addEventListener("click", async () => {

    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if (emailValue === "" || passwordValue === "") {
        alert("Please fill all fields.");
        return;
    }

    try {

        await signInWithEmailAndPassword(
            auth,
            emailValue,
            passwordValue
        );

        alert("Login Successful!");

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

    const emailValue = email.value.trim();

    if (emailValue === "") {
        alert("Enter your email first.");
        return;
    }

    try {

        await sendPasswordResetEmail(auth, emailValue);

        alert("Password reset email sent.");

    } catch (error) {

        alert(error.message);

    }

});


// ==========================
// Create Account Button
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
