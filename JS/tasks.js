document.addEventListener("DOMContentLoaded", function () {
    const taskList = document.getElementById("taskList");
    const notesArea = document.querySelector(".notes");
    const totalTasks = 10;

    // Load tasks and notes from localStorage
    function loadContent() {
        loadTasks();
        loadNotes();
    }

    // Load tasks or create empty ones
    function loadTasks() {
        taskList.innerHTML = ""; // Clear UI
        let tasks = JSON.parse(localStorage.getItem("tasks")) || Array(totalTasks).fill(""); // Default 10 empty tasks

        // Ensure there are always 10 tasks
        while (tasks.length < totalTasks) {
            tasks.push("");
        }

        tasks.slice(0, totalTasks).forEach((taskText, index) => {
            addTaskToUI(taskText, index);
        });
    }

    // Save tasks to localStorage
    function saveTasks() {
        const tasks = Array.from(taskList.children).map(li => li.querySelector(".task-text").innerText);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Load notes
    function loadNotes() {
        const savedNotes = localStorage.getItem("notes") || "";
        notesArea.value = savedNotes;
    }

    // Save notes
    function saveNotes() {
        localStorage.setItem("notes", notesArea.value);
    }

    // Create a task row in UI
    function addTaskToUI(taskText, index) {
        const li = document.createElement("li");
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox">
            <span class="task-text" contenteditable="true">${taskText}</span>
        `;
        taskList.appendChild(li);

        // Handle checkbox completion
        li.querySelector(".task-checkbox").addEventListener("change", function () {
            li.querySelector(".task-text").classList.toggle("completed", this.checked);
            saveTasks();
        });

        // Handle inline editing
        li.querySelector(".task-text").addEventListener("input", saveTasks);
    }

    // Event listener for saving notes
    notesArea.addEventListener("input", saveNotes);

    loadContent(); // Load tasks and notes on page load
});
