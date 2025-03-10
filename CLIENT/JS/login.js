// @ts-nocheck
import FAJAX from "../../network/FAJAX.js";

// Track if the login page has been initialized
let loginPageInitialized = false;

// Main initialization function that works with SPA structure
function initLoginPage() {
  // Prevent multiple initializations
  if (loginPageInitialized) return;

  const loginForm = document.getElementById("login-form");
  const usernameInput = document.getElementById("login-username");
  const passwordInput = document.getElementById("login-password");
  const registerError = document.getElementById("login-error"); 

  // Hide any error messages initially
  if (loginError) {
    loginError.style.display = "none";
  }

  loginForm.addEventListener("submit", function(event) {
    event.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!username || !password) {
      displayLoginError("Please enter both username and password");
      return;
    }
    
    // Create credentials object
    const credentials = {
      username: username,
      password: password
    };
    
    // Attempt login
    AuthService.login(credentials, (success, userData) => {
      if (success) {
        // Clear form
        loginForm.reset();
        
        // Store user data in sessionStorage
        sessionStorage.setItem("currentUser", JSON.stringify(userData));
        
        // Redirect to tasks page
        window.location.hash = "#tasksPage";
      } else {
        displayLoginError("Invalid username or password");
      }
    });
  });

  // Helper function to display login errors
  function displayLoginError(message) {
    if (loginError) {
      loginError.textContent = message;
      loginError.style.display = "block";
    } else {
      alert(`❌ ${message}`);
    }
  }

  // Mark as initialized
  loginPageInitialized = true;
  console.log("Login page initialized");
}

// Reset initialization flag when leaving the login page
function resetLoginPageInit() {
  if (location.hash !== "#loginPage") {
    loginPageInitialized = false;
    console.log("Login page initialization reset");
  }
}

// Listen for hash changes to reset initialization when leaving login page
window.addEventListener("hashchange", resetLoginPageInit);

// Create a MutationObserver to detect when the login page is loaded
const observer = new MutationObserver((mutations) => {
  // Only proceed if we're on the login page and it's not yet initialized
  if (location.hash === "#loginPage" && !loginPageInitialized) {
    // Check if the necessary elements exist
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
      // Allow a small delay for the DOM to settle
      setTimeout(initLoginPage, 50);
    }
  }
});

// Start observing the app container for changes
document.addEventListener("DOMContentLoaded", () => {
  const appContainer = document.getElementById("app-container");
  if (appContainer) {
    observer.observe(appContainer, { childList: true, subtree: true });
  }
});

// Authentication Service
const AuthService = {
  login(credentials, callback) {
    const xhr = new FAJAX();
    xhr.send(
      {
        type: "GET",
        url: "/users",
        data: credentials
      },
      () => {
        try {
          const response = JSON.parse(xhr.responseText);
          
          if (response.status === 200 && response.user) {
            console.log("Login successful:", response.user.username);
            callback(true, response.user);
          } else {
            console.error("Login failed:", response.error);
            callback(false);
          }
        } catch (error) {
          console.error("Error parsing login response:", error);
          callback(false);
        }
      }
    );
  },

//   logout() {
//     // Remove user data from session storage
//     sessionStorage.removeItem("currentUser");
    
//     // Redirect to login page
//     window.location.hash = "#loginPage";
//     console.log("User logged out successfully");
//   },
  
//   isLoggedIn() {
//     return sessionStorage.getItem("currentUser") !== null;
//   },
  
//   getCurrentUser() {
//     const userData = sessionStorage.getItem("currentUser");
//     return userData ? JSON.parse(userData) : null;
//   }
};

// Export functions for global access if needed
window.login = AuthService.login;
// window.logout = AuthService.logout;
// window.isLoggedIn = AuthService.isLoggedIn;
// window.getCurrentUser = AuthService.getCurrentUser;