import { auth, provider } from "./firebase-config.js";
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// Function to show toast messages
function showToast(message, success = true) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.backgroundColor = success ? "green" : "red"; // Green for success, red for error

    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000); // Hide after 3 seconds
}

const googleBtn = document.getElementById("google-signin-btn");

googleBtn.addEventListener("click", () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            showToast(`Welcome ${user.displayName}`, true);
            console.log(user);
            setTimeout(() => {
                window.location.href = "index.html"; // Redirect after showing toast
            }, 2000);
        })
        .catch((error) => {
            console.error(error);
            showToast("Google Sign-In failed!", false);
        });
});
