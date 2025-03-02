
// SPA Navigation Handler
const app = {
    init: function() {

        // Handle form button navigation
        document.querySelectorAll("form button").forEach(button => {
            button.addEventListener("click", app.handleNavigation);
        });

        // Handle "Sign up" link navigation
        document.getElementById("signUpLink").addEventListener("click", function(event) {
            event.preventDefault();
            app.showPage("registerPage", true);
        });

        // Handle browser back/forward buttons
        window.addEventListener("popstate", app.handlePopState);

        // Set default page to #loginPage if there's no hash in the URL
        if (!location.hash) {
            history.replaceState({ page: "loginPage" }, "", "#loginPage");
        }

        // Show the correct page on initial load
        let page = location.hash.replace("#", "") || "loginPage";
        app.showPage(page, false);
    },

    handleNavigation: function(event) {
        event.preventDefault(); // Prevent form submission

        let targetPage = "";

        if (event.target.closest("form").id === "register-form") {
            targetPage = "loginPage"; // After register, go to login
        } else if (event.target.closest("form").id === "login-form") {
            targetPage = "tasksPage"; // After login, go to tasks
        }

        if (targetPage) {
            app.showPage(targetPage, true);
        }
    },

    showPage: function(pageId, addToHistory = true) {
        document.querySelectorAll(".page").forEach(div => div.style.display = "none"); // Hide all pages
        document.getElementById(pageId).style.display = "block"; // Show the target page

        if (addToHistory) {
            history.pushState({ page: pageId }, "", `#${pageId}`); // Update browser history
        }
    },

    handlePopState: function(event) {
        let page = event.state ? event.state.page : "loginPage"; // Default to loginPage
        app.showPage(page, false);
    }
};

// Initialize the SPA
document.addEventListener("DOMContentLoaded", app.init);
