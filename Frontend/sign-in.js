import { auth, signInWithEmailAndPassword } from "./firebase-config.js";


function showToast(message, type) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000); // Hide after 3 seconds
}

document.getElementById("signin-btn").addEventListener("click", function (event) {
    event.preventDefault();

    const email = document.getElementById("signin-email").value;
    const password = document.getElementById("signin-password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showToast("Login successful!", "success");
            console.log("User:", userCredential.user);
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500); // Redirect after 1.5 seconds
        })
        .catch((error) => {
            showToast("Error: " + error.message, "error");
            console.error(error);
        });
});
