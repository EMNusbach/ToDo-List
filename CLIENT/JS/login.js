// @ts-nocheck
import FAJAX from "../../network/FAJAX.js";

// Main initialization function 
export function initLoginPage() {

  const loginForm = document.getElementById("login-form");
  const usernameInput = document.getElementById("login-username");
  const passwordInput = document.getElementById("login-password");

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

        loginForm.reset(); // Clear form
        sessionStorage.setItem("currentUser", JSON.stringify(userData)); // Store user data in sessionStorage
        window.location.hash = "#tasksPage";  // Redirect to tasks page

      } else {
        displayLoginError("Invalid username or password");
      }
    });
  });
}

// Helper function to display login errors
function displayLoginError(message) {
  const loginError = document.getElementById("login-error"); 
  if (loginError) {
    loginError.textContent = message;
    loginError.style.display = "block";
  } else {
    alert(`❌ ${message}`);
  }
}


// Authentication Service
const AuthService = {
  login(credentials, callback) {

    // Validate credentials before sending request
    if (!credentials.username || !credentials.password) {
      console.error("Missing username or password");
      callback(false);
      return;
    }

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

            // Store userId in sessionStorage after successful login
            sessionStorage.setItem("usersId", response.user.id); 
            //sessionStorage.setItem("currentUser", JSON.stringify(response.user));

            callback(true, response.user);
          } else {
            console.error("Login failed:", response.message || "Unknown error");
            callback(false);
          }
        } catch (error) {
          console.error("Error parsing login response:", error);
          callback(false);
        }
      }
    );
  },
};

// Export the auth service for global access if needed
window.login = AuthService.login;
