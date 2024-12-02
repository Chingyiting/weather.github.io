import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

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

const user = auth.currentUser;

function updateUserProfile(user) {
    const userProfilePicture = user.photoURL;
    document.getElementById("userProfilePicture").src = userProfilePicture;
}

onAuthStateChanged(auth, (user) =>{
    if(user) {
        updateUserProfile(user);
        const uid = user.uid;
        return uid;

    } else {
        // when the user is not logged in and is not logged out, a prompt is displayed
        if (!isLoggingOut) {
            alert("Create Account & Login");
        }
    }
});