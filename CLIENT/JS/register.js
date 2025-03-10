// @ts-nocheck
import FAJAX from "../../network/FAJAX.js"

// Track if the register page has been initialized
let registerPageInitialized = false;

// Main initialization function that works with SPA structure
export function initRegisterPage() {

  // Prevent multiple initializations
  if (registerPageInitialized) return;

  console.log("Initializing register page...");

  const registerForm = document.getElementById("register-form");
  const usernameInput = document.getElementById("register-username");
  const emailInput = document.getElementById("register-email");
  const passwordInput = document.getElementById("register-password");
  const confirmPasswordInput = document.getElementById("confirm-password");

  // Make sure all required elements exist
  if (!registerForm || !usernameInput || !emailInput || !passwordInput || !confirmPasswordInput) {
    console.error("Missing required form elements for registration");
    return;
  }

  registerForm.addEventListener("submit", function(event) {
    event.preventDefault();
    
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    
    // Basic form validation
    if (!username || !email || !password || !confirmPassword) {
      displayRegisterError("Please fill out all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      displayRegisterError("Passwords do not match");
      return;
    }
    
    // Create user object
    const user = {
        username: username,
        email: email,
        password: password
    };

    console.log("register service");
    
    // Attempt registration
    RegisterService.register(user, (success, userData) => {
      if (success) {
        // Clear form
        registerForm.reset();
        
        // Store user data in sessionStorage for automatic login
        sessionStorage.setItem("currentUser", JSON.stringify(userData));
        
        window.location.hash = "#tasksPage";
      } else {
        // Error handling is done in the register method
      }
    });
  });

  // Mark as initialized
  registerPageInitialized = true;
  console.log("Register page fully initialized");
}

// Helper function to display registration errors
function displayRegisterError(message) {
    const registerError = document.getElementById("register-error"); 
    if (registerError) {
        registerError.textContent = message;
        registerError.style.display = "block";
    } else {
        alert(`❌ ${message}`);
    }
}


// Reset initialization flag when leaving the register page
function resetRegisterPageInit() {
  if (location.hash !== "#registerPage") {
    registerPageInitialized = false;
    console.log("Register page initialization reset");
  }
}

// Listen for hash changes to reset initialization when leaving register page
window.addEventListener("hashchange", resetRegisterPageInit);

// Registration Service
const RegisterService = {
    register(user, callback) {
      const xhr = new FAJAX();
      xhr.send(
        {
          type: "POST",
          url: "/users",
          data: user
        },
        function() {
          try {
            // Check if the response is valid
            if (xhr.status === 200) {
              const response = JSON.parse(xhr.responseText);
              
              if (response.status === 201 && response.user) {
                console.log("Registration successful:", response.user.username);
                callback(true, response.user);
              } else {
                // Display specific error message
                const errorMessage = response.error || "Registration failed";
                displayRegisterError(errorMessage);
                callback(false);
              }
            } else {
              // Server error
              console.error("Server error:", xhr.status);
              displayRegisterError("Server error. Please try again later.");
              callback(false);
            }
          } catch (error) {
            console.error("Error parsing registration response:", error);
            displayRegisterError("Registration failed. Please try again.");
            callback(false);
          }
        }
      );
    }
  };
  
// Export functions for global access
window.initRegisterPage = initRegisterPage;
window.RegisterService = RegisterService;

// // Create a MutationObserver to detect when the register page is loaded
// const observer = new MutationObserver((mutations) => {
//   // Only proceed if we're on the register page and it's not yet initialized
//   if (location.hash === "#registerPage" && !registerPageInitialized) {
//     // Check if the necessary elements exist
//     const registerForm = document.getElementById("register-form");

//     if (registerForm) {
//       // Allow a small delay for the DOM to settle
//       setTimeout(initRegisterPage, 50);
//     }
//   }
// });

// // Start observing the app container for changes
// document.addEventListener("DOMContentLoaded", () => {
//   const appContainer = document.getElementById("app-container");
//   if (appContainer) {
//     observer.observe(appContainer, { childList: true, subtree: true });
//   }
// });

// // Registration Service
// const RegisterService = {
//   register(user, callback) {
//     const xhr = new FAJAX();
//     xhr.send(
//       {
//         type: "POST",
//         url: "/users",
//         data: user
//       },
//       () => {
//         try {
//           const response = JSON.parse(xhr.responseText);
          
//           if (response.status === 201 && response.user) {
//             console.log("Registration successful:", response.user.username);
//             callback(true, response.user);
//           } else {
//             // Display specific error message
//             const errorMessage = response.error || "Registration failed";
//             const registerError = document.getElementById("register-error");
//             if (registerError) {
//               registerError.textContent = errorMessage;
//               registerError.style.display = "block";
//             } else {
//               alert(`❌ ${errorMessage}`);
//             }
//             callback(false);
//           }
//         } catch (error) {
//           console.error("Error parsing registration response:", error);
//           alert("❌ Registration failed. Please try again.");
//           callback(false);
//         }
//       }
//     );
//   },  
// };

// // Export functions for global access
// window.initRegisterPage = initRegisterPage;
// window.RegisterService = RegisterService;