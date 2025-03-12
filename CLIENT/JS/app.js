// @ts-nocheck

import { initLoginPage } from "./login.js";
import { initRegisterPage } from "./register.js"
console.log("im in app.js");
const app = {
    init: function () {
    
         // Set default page to login if no hash
        if (!location.hash) {
            history.replaceState({ page: "loginPage" }, "", "#loginPage");
        }

        // Handle initial page load
        this.handleHashChange();

        // Handle "Sign up" link navigation
        document.addEventListener("click", this.handleLinkClick.bind(this));

        // Handle hash changes (including back/forward navigation)
        window.addEventListener("hashchange", this.handleHashChange.bind(this));
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

            this.initPageScripts(pageId); // Initialize page-specific scripts after content is added to DOM
        } else {
            console.error(`Template "${pageId}" not found`);
        }
    },

    initPageScripts: function(pageId) {

        // Call specific initializers based on the current page
        switch(pageId) {
            case "registerPage":
                if (typeof initRegisterPage === 'function') {
                    initRegisterPage();
                }
                break;
            case "loginPage":
                console.log("im in app login app.js")
                if (typeof initLoginPage === 'function') {
                    initLoginPage();
                }
                break;
            case "tasksPage":
                // console.log("Initializing tasks page");
                // tasksPageController.init();
                break;
        }
    },
  
    handleHashChange: function () {
        const pageId = location.hash.replace("#", "") || "loginPage";
        this.showPage(pageId);
    }
};
  
// Initialize the SPA
document.addEventListener("DOMContentLoaded", app.init.bind(app));