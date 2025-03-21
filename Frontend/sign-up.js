import { auth, createUserWithEmailAndPassword } from "./firebase-config.js";


function showToast(message, type) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000); 
}

document.getElementById("signup-btn").addEventListener("click", function (event) {
    event.preventDefault();

    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        showToast("Passwords do not match!", "error");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showToast("Sign-up successful! Redirecting to Sign-in...", "success");
            console.log("User:", userCredential.user);

            
            setTimeout(() => {
                window.location.href = "login.html"; 
            }, 2000);
        })
        .catch((error) => {
            showToast("Error: " + error.message, "error");
            console.error(error);
        });
});
