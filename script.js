// ===============================
// Firebase Configuration
// ===============================

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// ===============================
// Show / Hide Password
// ===============================

const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");

togglePassword.onclick = () => {

    if(password.type==="password"){
        password.type="text";
        togglePassword.innerHTML="🙈";
    }else{
        password.type="password";
        togglePassword.innerHTML="👁";
    }

};

// ===============================
// Login
// ===============================

const loginBtn = document.getElementById("loginBtn");

loginBtn.onclick = async ()=>{

    const username=document.getElementById("username").value.trim();

    const pass=password.value;

    const error=document.getElementById("error");

    error.innerHTML="";

    if(username===""||pass===""){

        error.innerHTML="Please fill all fields.";

        return;

    }

    try{

        // Search username in Firestore

        const snapshot=await db.collection("users")
        .where("username","==",username)
        .get();

        if(snapshot.empty){

            error.innerHTML="Username not found.";

            return;

        }

        const user=snapshot.docs[0].data();

        // Hidden email used for Firebase Auth

        await auth.signInWithEmailAndPassword(user.email,pass);

        window.location.href="home.html";

    }catch(e){

        error.innerHTML="Invalid username or password.";

    }

};
