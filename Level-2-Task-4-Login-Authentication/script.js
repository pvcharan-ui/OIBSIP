// =========================================
// PVS LOGIN AUTHENTICATION SYSTEM
// script.js
// =========================================

// ---------- SHA-256 HASH FUNCTION ----------
async function hashPassword(password) {

    const encoder = new TextEncoder();

    const data = encoder.encode(password);

    const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        data
    );

    const hashArray = Array.from(
        new Uint8Array(hashBuffer)
    );

    const hashHex = hashArray
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

    return hashHex;
}

// ---------- GET USERS ----------
function getUsers() {

    return JSON.parse(
        localStorage.getItem("users")
    ) || [];

}

// ---------- SAVE USERS ----------
function saveUsers(users) {

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

}

// ---------- PASSWORD VALIDATION ----------
function validatePassword(password){

    // Minimum 8 characters
    if(password.length < 8){

        alert(
            "Password must contain at least 8 characters."
        );

        return false;

    }

    // At least one number

    const numberRegex = /\d/;

    if(!numberRegex.test(password)){

        alert(
            "Password must contain at least one number."
        );

        return false;

    }

    return true;

}

// ---------- SESSION ----------
function setSession(user){

    localStorage.setItem(
        "loggedInUser",
        JSON.stringify(user)
    );

}

function getSession(){

    return JSON.parse(
        localStorage.getItem("loggedInUser")
    );

}

function clearSession(){

    localStorage.removeItem(
        "loggedInUser"
    );

}
// =========================================
// REGISTER USER
// =========================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const username = document
            .getElementById("username")
            .value
            .trim();

        const fullName = document
            .getElementById("name")
            .value
            .trim();

        const email = document
            .getElementById("email")
            .value
            .trim()
            .toLowerCase();

        const password = document
            .getElementById("password")
            .value;

        const confirmPassword = document
            .getElementById("confirmPassword")
            .value;

        // -------------------------
        // Empty Fields
        // -------------------------

        if (
            username === "" ||
            fullName === "" ||
            email === "" ||
            password === "" ||
            confirmPassword === ""
        ) {

            alert("Please fill in all fields.");

            return;
        }

        // -------------------------
        // Email Validation
        // -------------------------

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {

            alert("Enter a valid email address.");

            return;
        }

        // -------------------------
        // Password Validation
        // -------------------------

        if (!validatePassword(password))
            return;

        // -------------------------
        // Confirm Password
        // -------------------------

        if (password !== confirmPassword) {

            alert("Passwords do not match.");

            return;
        }

        // -------------------------
        // Duplicate Check
        // -------------------------

        const users = getUsers();

        const usernameExists = users.some(
            user =>
                user.username.toLowerCase() ===
                username.toLowerCase()
        );

        if (usernameExists) {

            alert("Username already exists.");

            return;
        }

        const emailExists = users.some(
            user =>
                user.email.toLowerCase() === email
        );

        if (emailExists) {

            alert("Email already registered.");

            return;
        }

        // -------------------------
        // Hash Password
        // -------------------------

        const hashedPassword =
            await hashPassword(password);

        // -------------------------
        // Save User
        // -------------------------

        users.push({

            username: username,

            fullName: fullName,

            email: email,

            password: hashedPassword

        });

        saveUsers(users);

        alert(
            "Registration Successful!"
        );

        window.location.href = "index.html";

    });

}
// =========================================
// LOGIN USER
// =========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const email = document
            .getElementById("loginEmail")
            .value
            .trim()
            .toLowerCase();

        const password = document
            .getElementById("loginPassword")
            .value;

        if (email === "" || password === "") {

            alert("Please fill in all fields.");

            return;

        }

        const users = getUsers();

        const hashedPassword = await hashPassword(password);

        const user = users.find(u =>
            u.email === email &&
            u.password === hashedPassword
        );

        if (!user) {

            alert("Invalid email or password.");

            return;

        }

        // -------------------------
        // CREATE SESSION
        // -------------------------

        setSession({

            username: user.username,

            fullName: user.fullName,

            email: user.email

        });

        alert("Login Successful!");

        window.location.href = "dashboard.html";

    });

}

// =========================================
// SHOW / HIDE PASSWORD
// =========================================

const togglePassword = document.getElementById("togglePassword");

if (togglePassword) {

    togglePassword.addEventListener("click", function () {

        const passwordInput =
            document.getElementById("loginPassword");

        const icon =
            togglePassword.querySelector("i");

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            icon.classList.remove("fa-eye");

            icon.classList.add("fa-eye-slash");

        }

        else {

            passwordInput.type = "password";

            icon.classList.remove("fa-eye-slash");

            icon.classList.add("fa-eye");

        }

    });

}
// =========================================
// DASHBOARD PROTECTION
// =========================================

const currentUser = getSession();

if (window.location.pathname.includes("dashboard.html")) {

    if (!currentUser) {

        alert("Please login first.");

        window.location.href = "index.html";

    } else {

        const welcomeUser = document.getElementById("welcomeUser");
        const displayName = document.getElementById("displayName");
        const displayEmail = document.getElementById("displayEmail");

        if (welcomeUser)
            welcomeUser.textContent =
                currentUser.username;

        if (displayName)
            displayName.textContent =
                currentUser.fullName;

        if (displayEmail)
            displayEmail.textContent =
                currentUser.email;

    }

}

// =========================================
// LOGOUT
// =========================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        const confirmLogout =
            confirm("Are you sure you want to logout?");

        if (!confirmLogout)
            return;

        clearSession();

        alert("Logged out successfully.");

        window.location.href = "index.html";

    });

}

// =========================================
// REDIRECT IF ALREADY LOGGED IN
// =========================================

if (
    window.location.pathname.includes("index.html") ||
    window.location.pathname.endsWith("/")
) {

    if (currentUser) {

        window.location.href = "dashboard.html";

    }

}

// =========================================
// PREVENT BACK BUTTON AFTER LOGOUT
// =========================================

window.history.pushState(null, "", window.location.href);

window.onpopstate = function () {

    window.history.pushState(null, "", window.location.href);

};