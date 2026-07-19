import {
createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
doc,
setDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const auth = window.auth;
const db = window.db;

const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const signupBtn = document.getElementById("signupBtn");
const error = document.getElementById("error");

signupBtn.addEventListener("click", async () => {

const userName = username.value.trim();
const userEmail = email.value.trim();
const userPassword = password.value.trim();

if(userName===""||userEmail===""||userPassword===""){
error.innerHTML="Please fill all fields.";
return;
}

try{

const userCredential = await createUserWithEmailAndPassword(
auth,
userEmail,
userPassword
);

await setDoc(doc(db,"users",userCredential.user.uid),{

username:userName,
email:userEmail,
uid:userCredential.user.uid,
createdAt:new Date()

});

error.style.color="green";
error.innerHTML="Account Created Successfully";

setTimeout(()=>{

window.location.href="index.html";

},1500);

}catch(err){

error.style.color="red";
error.innerHTML=err.message;

}

});
