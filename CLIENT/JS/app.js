const app = {
  init: function () {
    // Handle form button navigation
    document.querySelectorAll("form button").forEach((button) => {
      button.addEventListener("click", app.handleNavigation);
    });

    // Handle "Sign up" link navigation
    document
      .getElementById("signUpLink")
      .addEventListener("click", function (event) {
        event.preventDefault();
        app.showPage("registerPage", true);
      });

    // Handle browser back/forward buttons
    window.addEventListener("popstate", app.handlePopState);

    // Handle hash change event
    window.addEventListener("hashchange", app.handleHashChange);

    // Ensure the correct page is shown on initial load
    app.handleHashChange();

    // Ensure the URL has #loginPage on first load if there's no hash
    if (!location.hash) {
      history.replaceState({ page: "loginPage" }, "", "#loginPage");
    }
  },

  handleNavigation: function (event) {
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

  showPage: function (pageId, addToHistory = true) {
    document
      .querySelectorAll(".page")
      .forEach((div) => (div.style.display = "none")); // Hide all pages
    let targetPage = document.getElementById(pageId);

    if (targetPage) {
      targetPage.style.display = "block"; // Show the target page

      if (addToHistory) {
        history.pushState({ page: pageId }, "", `#${pageId}`); // Update browser history
      }
    } else {
      console.error(`Page ID "${pageId}" not found.`);
    }
  },

  handlePopState: function (event) {
    let page = event.state ? event.state.page : "loginPage"; // Default to loginPage
    app.showPage(page, false);
  },

  handleHashChange: function () {
    let page = location.hash.replace("#", "") || "loginPage";
    app.showPage(page, false);
  },
};

// Initialize the SPA
document.addEventListener("DOMContentLoaded", app.init);
