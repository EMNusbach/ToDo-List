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

        // Handle hash change event
        window.addEventListener("hashchange", app.handleHashChange);

        // Ensure the correct page is shown on initial load
        app.handleHashChange();

        // Ensure the URL has #loginPage on first load if there's no hash
        if (!location.hash) {
            history.replaceState({ page: "loginPage" }, "", "#loginPage");
        }
    },

    handleNavigation: function(event) {
        event.preventDefault(); // Prevent form submission

        let targetPage = "";
        const form = event.target.closest("form");

        if (form && form.id === "register-form") {
            // Register the user
            const username = form.querySelector("#register-username").value;
            const password = form.querySelector("#register-password").value;
            app.registerUser(username, password);
            targetPage = "loginPage"; // After register, go to login
        } else if (form && form.id === "login-form") {
            // Login the user
            const username = form.querySelector("#login-username").value;
            const password = form.querySelector("#login-password").value;
            app.loginUser(username, password);
            targetPage = "tasksPage"; // After login, go to tasks
        }

        if (targetPage) {
            app.showPage(targetPage, true);
        }
    },

    showPage: function(pageId, addToHistory = true) {
        document.querySelectorAll(".page").forEach(div => div.style.display = "none"); // Hide all pages
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

    handlePopState: function(event) {
        let page = event.state ? event.state.page : "loginPage"; // Default to loginPage
        app.showPage(page, false);
    },

    handleHashChange: function() {
        let page = location.hash.replace("#", "") || "loginPage";
        app.showPage(page, false);
    },

    // User registration logic
    registerUser: async function(username, password) {
        const response = await registerUser(username, password); // Call to usersAPI.js
        if (response.success) {
            alert("Registration successful! You can now login.");
        } else {
            alert(response.message || "Registration failed.");
        }
    },

    // User login logic
    loginUser: async function(username, password) {
        const response = await loginUser(username, password); // Call to usersAPI.js
        if (response.message === "Login successful") {
            localStorage.setItem("loggedInUser", username); // Store username
            app.showPage("tasksPage", true);
            app.loadTasks(username); // Load tasks for the logged-in user
        } else {
            alert(response.message || "Login failed.");
        }
    },

    // Load tasks for logged-in user
    loadTasks: async function(username) {
        const data = await getTasksAndNote(username); // Call to tasksAPI.js
        const taskListContainer = document.getElementById("task-list");
        const noteContainer = document.getElementById("note");

        // Clear previous content
        taskListContainer.innerHTML = "";
        noteContainer.textContent = "";

        if (data.tasks.length === 0) {
            taskListContainer.innerHTML = "<li>No tasks found</li>";
        } else {
            data.tasks.forEach((task, index) => {
                const taskItem = document.createElement("li");
                taskItem.textContent = `${task.task} - ${task.status}`;

                // Add a button to mark task as completed
                if (task.status === "incomplete") {
                    const completeBtn = document.createElement("button");
                    completeBtn.textContent = "Complete";
                    completeBtn.addEventListener("click", async () => {
                        await updateTaskStatus(username, index, "completed");
                        app.loadTasks(username); // Reload after update
                    });
                    taskItem.appendChild(completeBtn);
                }

                taskListContainer.appendChild(taskItem);
            });
        }

        // Show the user's note
        if (data.note) {
            noteContainer.textContent = `Note: ${data.note}`;
        }
    }
};

// Initialize the SPA
document.addEventListener("DOMContentLoaded", app.init);
