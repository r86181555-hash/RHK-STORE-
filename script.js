// ======================================
// IMPORT FIREBASE
// ======================================

import { auth, db } from "./firebase.js";

import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    doc,
    getDoc,
    updateDoc,
    serverTimestamp,
    arrayUnion,
    arrayRemove
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


// ======================================
// CLOUDINARY
// ======================================

const CLOUD_NAME = "nhy9Ifkt";
const UPLOAD_PRESET = "rhk_upload";


// ======================================
// DOM
// ======================================

const loader = document.getElementById("loader");
const feed = document.getElementById("feed");
const stories = document.getElementById("stories");

const myPhoto = document.getElementById("myPhoto");
const bottomProfile = document.getElementById("bottomProfile");

const uploadPopup = document.getElementById("uploadPopup");

const addPost = document.getElementById("addPost");

const closeUpload = document.getElementById("closeUpload");

const postFile = document.getElementById("postFile");

const preview = document.getElementById("preview");

const caption = document.getElementById("caption");

const sharePost = document.getElementById("sharePost");


// ======================================
// VARIABLES
// ======================================

let currentUser = null;

let currentUserData = null;

let selectedFile = null;


// ======================================
// AUTH
// ======================================

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        window.location="login.html";

        return;

    }

    currentUser=user;

    await loadCurrentUser();

    loadStories();

    loadPosts();

});


// ======================================
// LOAD USER
// ======================================

async function loadCurrentUser(){

    try{

        const snap=await getDoc(
            doc(db,"users",currentUser.uid)
        );

        if(snap.exists()){

            currentUserData=snap.data();

            myPhoto.src=
            currentUserData.photoURL ||
            "images/default.png";

            bottomProfile.src=
            currentUserData.photoURL ||
            "images/default.png";

        }

    }catch(e){

        console.log(e);

    }

    loader.style.display="none";

}


// ======================================
// LOAD STORIES
// ======================================

function loadStories(){

    const q=query(

        collection(db,"stories"),

        orderBy("createdAt","desc")

    );

    onSnapshot(q,(snapshot)=>{

        stories.innerHTML="";

        if(snapshot.empty){

            return;

        }

        snapshot.forEach(async(docSnap)=>{

            const story=docSnap.data();

            const userSnap=await getDoc(
                doc(db,"users",story.uid)
            );

            if(!userSnap.exists()) return;

            const user=userSnap.data();

            stories.innerHTML+=`

<div class="story">

<div class="storyImage">

<img src="${user.photoURL || 'images/default.png'}">

</div>

<p>${user.username}</p>

</div>

`;

        });

    });

}
// ======================================
// LOAD POSTS
// ======================================

function loadPosts() {

    const q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc")
    );

    onSnapshot(q, async (snapshot) => {

        if (snapshot.empty) {

            feed.innerHTML = `

<div class="emptyFeed">

<i class="fa-regular fa-image"></i>

<h2>No Posts Yet</h2>

<p>
When users upload posts,
they will automatically appear here.
</p>

</div>

`;

            return;
        }

        feed.innerHTML = "";

        for (const docSnap of snapshot.docs) {

            await renderPost(docSnap);

        }

    });

}


// ======================================
// RENDER POST
// ======================================

async function renderPost(docSnap) {

    const post = docSnap.data();

    const userSnap = await getDoc(
        doc(db, "users", post.uid)
    );

    if (!userSnap.exists()) return;

    const user = userSnap.data();

    const postDiv = document.createElement("div");

    postDiv.className = "post";

    postDiv.innerHTML = `

<div class="postHeader">

<div class="postLeft">

<img
class="postProfile"
src="${user.photoURL || 'images/default.png'}">

<div>

<div class="postUser">

${user.username}

</div>

<div class="postTime">

${post.location || ""}

</div>

</div>

</div>

<button class="moreBtn">

<i class="fa-solid fa-ellipsis"></i>

</button>

</div>

<div class="postMedia">

${
post.type === "video"

?

`<video
controls
playsinline
src="${post.media}">
</video>`

:

`<img
src="${post.media}">`

}

</div>

<div class="postActions">

<div class="leftActions">

<button class="likeBtn">

<i class="fa-regular fa-heart"></i>

</button>

<button class="commentBtn">

<i class="fa-regular fa-comment"></i>

</button>

<button class="shareBtn">

<i class="fa-regular fa-paper-plane"></i>

</button>

</div>

<button class="saveBtn">

<i class="fa-regular fa-bookmark"></i>

</button>

</div>

<div class="postInfo">

<div class="likes">

${post.likes ? post.likes.length : 0} Likes

</div>

<div class="caption">

<b>${user.username}</b>

${post.caption || ""}

</div>

</div>

`;

    feed.appendChild(postDiv);

    setupButtons(postDiv, docSnap.id, post);

}


// ======================================
// BUTTON EVENTS
// ======================================

function setupButtons(postDiv, postId, post) {

    const likeBtn = postDiv.querySelector(".likeBtn");

    const saveBtn = postDiv.querySelector(".saveBtn");

    const shareBtn = postDiv.querySelector(".shareBtn");

    const commentBtn = postDiv.querySelector(".commentBtn");


    // LIKE

    if (
        post.likes &&
        post.likes.includes(currentUser.uid)
    ) {

        likeBtn.innerHTML =
        `<i class="fa-solid fa-heart liked"></i>`;

    }

    likeBtn.onclick = async () => {

        const ref = doc(db, "posts", postId);

        if (
            post.likes &&
            post.likes.includes(currentUser.uid)
        ) {

            await updateDoc(ref, {

                likes: arrayRemove(currentUser.uid)

            });

        } else {

            await updateDoc(ref, {

                likes: arrayUnion(currentUser.uid)

            });

        }

    };


    // SAVE

    saveBtn.onclick = () => {

        saveBtn.classList.toggle("saved");

        saveBtn.innerHTML =

        saveBtn.classList.contains("saved")

        ?

        `<i class="fa-solid fa-bookmark"></i>`

        :

        `<i class="fa-regular fa-bookmark"></i>`;

    };


    // SHARE

    shareBtn.onclick = async () => {

        if (navigator.share) {

            navigator.share({

                title: "Instagram",

                url: window.location.href

            });

        } else {

            navigator.clipboard.writeText(
                window.location.href
            );

            showToast("Link copied");

        }

    };


    // COMMENT

    commentBtn.onclick = () => {

        showToast("Comments page coming soon");

    };

}
// ======================================
// OPEN / CLOSE UPLOAD POPUP
// ======================================

addPost.onclick = () => {

    uploadPopup.classList.add("show");

};

closeUpload.onclick = () => {

    uploadPopup.classList.remove("show");

    preview.innerHTML = "";

    postFile.value = "";

    caption.value = "";

    selectedFile = null;

};

uploadPopup.onclick = (e) => {

    if (e.target === uploadPopup) {

        closeUpload.click();

    }

};


// ======================================
// FILE PREVIEW
// ======================================

postFile.onchange = () => {

    selectedFile = postFile.files[0];

    if (!selectedFile) return;

    preview.innerHTML = "";

    if (selectedFile.type.startsWith("image")) {

        preview.innerHTML = `
        <img src="${URL.createObjectURL(selectedFile)}">
        `;

    } else {

        preview.innerHTML = `
        <video controls src="${URL.createObjectURL(selectedFile)}"></video>
        `;

    }

};


// ======================================
// CLOUDINARY UPLOAD
// ======================================

async function uploadToCloudinary(file) {

    const formData = new FormData();

    formData.append("file", file);

    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(

        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,

        {

            method: "POST",

            body: formData

        }

    );

    return await response.json();

}


// ======================================
// SHARE POST
// ======================================

sharePost.onclick = async () => {

    if (!selectedFile) {

        showToast("Select a photo or video");

        return;

    }

    try {

        sharePost.disabled = true;

        sharePost.innerText = "Uploading...";

        const upload = await uploadToCloudinary(selectedFile);

        await addDoc(

            collection(db, "posts"),

            {

                uid: currentUser.uid,

                media: upload.secure_url,

                type: selectedFile.type.startsWith("image")
                    ? "image"
                    : "video",

                caption: caption.value.trim(),

                likes: [],

                createdAt: serverTimestamp()

            }

        );

        showToast("Post uploaded");

        closeUpload.click();

    } catch (err) {

        console.error(err);

        showToast("Upload failed");

    }

    sharePost.disabled = false;

    sharePost.innerText = "Share";

};


// ======================================
// TOAST
// ======================================

function showToast(message) {

    const toast = document.getElementById("toast");

    toast.innerText = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


// ======================================
// STORY VIEWER
// ======================================

const storyViewer = document.getElementById("storyViewer");

const storyImage = document.getElementById("storyImage");

const storyVideo = document.getElementById("storyVideo");

const closeStory = document.getElementById("closeStory");

closeStory.onclick = () => {

    storyViewer.classList.remove("show");

    storyVideo.pause();

};


// ======================================
// BOTTOM NAVIGATION
// ======================================

document.getElementById("homeBtn").onclick = () => {

    location.href = "index.html";

};

document.getElementById("searchBtn").onclick = () => {

    location.href = "search.html";

};

document.getElementById("reelsBtn").onclick = () => {

    location.href = "reels.html";

};

document.getElementById("notificationBtn").onclick = () => {

    location.href = "notifications.html";

};

document.getElementById("profileBtn").onclick = () => {

    location.href = "profile.html";

};
