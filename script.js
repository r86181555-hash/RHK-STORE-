import {
signInWithEmailAndPassword,
sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const auth = window.auth;

const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const error = document.getElementById("error");

// Login
loginBtn.addEventListener("click", () => {

const userEmail = email.value.trim();
const userPassword = password.value.trim();

if(userEmail === "" || userPassword === ""){
error.innerHTML = "Please fill all fields.";
return;
}

signInWithEmailAndPassword(auth, userEmail, userPassword)

.then((userCredential)=>{

error.style.color="green";
error.innerHTML="Login Successful";

setTimeout(()=>{
window.location.href="home.html";
},1000);

})

.catch((err)=>{

error.style.color="red";

switch(err.code){

case "auth/invalid-email":
error.innerHTML="Invalid email.";
break;

case "auth/user-not-found":
error.innerHTML="User not found.";
break;

case "auth/wrong-password":
error.innerHTML="Wrong password.";
break;

case "auth/invalid-credential":
error.innerHTML="Invalid email or password.";
break;

default:
error.innerHTML=err.message;

}

});

});

// Forgot Password
document.querySelector(".forgot a").addEventListener("click",(e)=>{

e.preventDefault();

const userEmail=email.value.trim();

if(userEmail===""){
alert("Enter your email first.");
return;
}

sendPasswordResetEmail(auth,userEmail)

.then(()=>{
alert("Password reset email sent.");
})

.catch((err)=>{
alert(err.message);
});

});

// Create Account
signupBtn.addEventListener("click",()=>{

window.location.href="signup.html";

});
