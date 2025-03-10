// @ts-nocheck
const app = {
    init: function () {
        // Create app container if it doesn't exist
        if (!document.getElementById('app-container')) {
            const container = document.createElement('div');
            container.id = 'app-container';
            document.body.appendChild(container);
        }
    
        // Ensure the URL has #loginPage on first load if there's no hash
        if (!location.hash) {
            history.replaceState({ page: "loginPage" }, "", "#loginPage");
        }

        // Handle the initial page load based on hash
        this.handleHashChange();

        // Handle form button navigation
        document.addEventListener("submit", this.handleFormSubmit.bind(this));

        // Handle "Sign up" link navigation
        document.addEventListener("click", this.handleLinkClick.bind(this));

        // Handle browser back/forward buttons
        window.addEventListener("popstate", this.handlePopState.bind(this));

        // Handle hash change event
        window.addEventListener("hashchange", this.handleHashChange.bind(this));
    },
  
    handleFormSubmit: function (event) {
        event.preventDefault(); // Prevent form submission
        
        const formId = event.target.id;
        let targetPage = "";

        if (formId === "register-form") {
            // Validate registration form
            // const password = document.getElementById("register-password").value;
            // const confirmPassword = document.getElementById("confirm-password").value;
            
            // if (password !== confirmPassword) {
            //     alert("Passwords do not match!");
            //     return;
            // }

            // Send data to a server

            targetPage = "loginPage"; // After register, go to login
        } else if (formId === "login-form") {
            // Validate login check with a server

            targetPage = "tasksPage"; // After login, go to tasks
        }
        
        if (targetPage) {
            location.hash = targetPage; // This will trigger handleHashChange
        }
    },
    
    handleLinkClick: function (event) {
        if (event.target.id === "signUpLink") {
            event.preventDefault();
            location.hash = "registerPage";
        }
    },
  
    showPage: function (pageId) {
        let appContainer = document.getElementById('app-container');
        appContainer.innerHTML = ""; // Clear previous content

        let template = document.getElementById(pageId);
        if (template) {
            let content = template.content.cloneNode(true);
            appContainer.appendChild(content);
        } else {
            console.error(`Template "${pageId}" not found`);
        }
    },
  
    handlePopState: function (event) {
        // This handles browser back/forward navigation
        this.showPage(location.hash.replace("#", "") || "loginPage");
    },
  
    handleHashChange: function () {
        // This handles both manual hash changes and programmatic ones
        const pageId = location.hash.replace("#", "") || "loginPage";
        this.showPage(pageId);
    }
};
  
// Initialize the SPA
document.addEventListener("DOMContentLoaded", app.init.bind(app));