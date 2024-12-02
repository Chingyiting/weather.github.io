import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDdAkJ3MFmHf2IBAHoJgZdiCUzbOcPUdIM",
    authDomain: "my-first-project-17577.firebaseapp.com",
    projectId: "my-first-project-17577",
    storageBucket: "my-first-project-17577.firebasestorage.app",
    messagingSenderId: "621952405279",
    appId: "1:621952405279:web:5635f2efd5faa6e7f3aa2a",
    measurementId: "G-F465NDFXVT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();

const googleSignin = document.getElementById("googleSignInBtn");
googleSignin.addEventListener("click", function () {
    signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const user = result.user;
            console.log(user);
            window.location.href = "./logged.html";
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
})

// signOut 
const signOutBtn = document.getElementById("signOutBtn");
signOutBtn.addEventListener("click", function () {
    auth.signOut().then(() => {
        // Jump to other pages after sign out successfully
        alert("SIGN OUT SUCCESSFUL !!");
        window.location.href = "./weather.html";
    }).catch((error) => {
        console.error("SIGN OUT ERROR: ", error);
    });
});