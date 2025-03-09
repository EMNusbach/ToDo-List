// @ts-nocheck
import FAJAX from "../../network/FAJAX.js";

// Track if the tasks page has been initialized
let tasksPageInitialized = false;

// Main initialization that works with SPA structure
function initTasksPage() {
  // Prevent multiple initializations
  if (tasksPageInitialized) return;
  
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTask");
  const saveNotesBtn = document.getElementById("saveNotes");
  const notesTextarea = document.querySelector(".notes");

  if (!taskInput || !addTaskBtn) {
    console.error("Task page elements not found");
    return; // Exit if elements aren't found
  }

  addTaskBtn.addEventListener("click", function() {
    const taskText = taskInput.value.trim();
    if (!taskText) return; // Prevent adding empty tasks

    const task = { id: Date.now(), text: taskText, isCompleted: false };

    TaskService.save(task, (success) => {
      if (success) {
        TaskUI.add(task);
        taskInput.value = "";
      } else {
        alert("❌ Failed to save task. Please try again.");
      }
    });
  });

  if (saveNotesBtn && notesTextarea) {
    saveNotesBtn.addEventListener("click", function() {
      const notes = notesTextarea.value;
      NoteService.save(notes);
    });
  }

  // Load tasks and notes when tasks page is shown
  TaskService.load();
  NoteService.load();
  
  // Mark as initialized
  tasksPageInitialized = true;
  console.log("Tasks page initialized");
}

// Reset initialization flag when leaving the tasks page
function resetTasksPageInit() {
  if (location.hash !== '#tasksPage') {
    tasksPageInitialized = false;
    console.log("Tasks page initialization reset");
  }
}

// Listen for hash changes to reset initialization when leaving tasks page
window.addEventListener("hashchange", resetTasksPageInit);

// Create a MutationObserver to detect when the tasks page is loaded
const observer = new MutationObserver((mutations) => {
  // Only proceed if we're on the tasks page and it's not yet initialized
  if (location.hash === '#tasksPage' && !tasksPageInitialized) {
    // Check if the necessary elements exist
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTask");
    
    if (taskInput && addTaskBtn) {
      // Allow a small delay for the DOM to settle
      setTimeout(initTasksPage, 50);
    }
  }
});

// Start observing the app container for changes
document.addEventListener("DOMContentLoaded", () => {
  const appContainer = document.getElementById('app-container');
  if (appContainer) {
    observer.observe(appContainer, { childList: true, subtree: true });
  }
});

const TaskService = {
  load() {
    const taskList = document.getElementById("taskList");
    if (!taskList) return; // Exit if element not found

    taskList.innerHTML = "";
    const xhr = new FAJAX();
    xhr.send({ type: "GETALL", url: "/tasks" }, (response) => {
      try {
        const tasks = JSON.parse(response);
        console.table(tasks);
        tasks.forEach(TaskUI.add);
      } catch (error) {
        console.error("Error parsing tasks:", error);
        alert("❌ Failed to load tasks. Please try again.");
      }
    });
  },

  save(task, callback) {
    const xhr = new FAJAX();
    xhr.send({ type: "POST", url: "/tasks", data: task }, (response) => {
      try {
        const res = JSON.parse(response);
        callback(res && res.message === "Data received!");
      } catch (error) {
        console.error("Error parsing response:", error);
        alert("❌ Failed to save task. Please try again.");
        callback(false);
      }
    });
  },

  delete(task) {
    const xhr = new FAJAX();
    xhr.send(
      { type: "DELETE", url: `/tasks/${task.id}`, data: task.id },
      (response) => {
        if (xhr.status === 200 && xhr.readyState === 4) {
          try {
            const res = JSON.parse(response);
            if (res && res.message === "Item deleted") {
              console.log(`Task with ID ${task.id} deleted successfully.`);
              this.load();
            } else {
              console.error(
                `Failed to delete task with ID ${task.id}:`,
                res.error
              );
            }
          } catch (error) {
            console.error("Error parsing delete response:", error);
            alert("❌ Failed to delete task. Please try again.");
          }
        }
      }
    );
  },

  update(task) {
    const xhr = new FAJAX();
    console.log("Updating task:", task);
    xhr.send(
      {
        type: "PUT",
        url: `/tasks/${task.id}`,
        data: task,
      },
      (response) => {
        if (xhr.status === 200 && xhr.readyState === 4) {
          try {
            const res = JSON.parse(response);
            console.log("Update response:", res);

            if (res && res.message === "Item updated") {
              console.log(`Task with ID ${task.id} updated successfully.`);
              this.load();
            } else {
              console.error(
                `Failed to update task with ID ${task.id}:`,
                res.error
              );
            }
          } catch (error) {
            console.error("Error parsing update response:", error);
          }
        }
      }
    );
  },
};

const TaskUI = {
  add(task) {
    const taskList = document.getElementById("taskList");
    if (!taskList) return; // Skip if element not found

    const taskItem = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.isCompleted;
    checkbox.addEventListener("change", () => {
      task.isCompleted = checkbox.checked;
      TaskService.update(task);
    });

    const taskText = document.createElement("span");
    taskText.textContent = task.text;
    if (task.isCompleted) {
      taskText.style.textDecoration = "line-through";
    }

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-btn";
    editButton.addEventListener("click", () => {
      const newTaskText = prompt("Edit task:", taskText.textContent);
      if (newTaskText) {
        task.text = newTaskText;
        TaskService.update(task);
      }
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";
    deleteButton.addEventListener("click", () => TaskService.delete(task));

    taskItem.append(checkbox, taskText, editButton, deleteButton);
    taskList.appendChild(taskItem);
  },
};

// Add missing NoteService
const NoteService = {
  load() {
    const notesTextarea = document.querySelector(".notes");
    if (!notesTextarea) return;

    const xhr = new FAJAX();
    xhr.send({ type: "GETALL", url: "/notes" }, (response) => {
      try {
        const notes = JSON.parse(response);
        if (notes && notes.length > 0) {
          notesTextarea.value = notes[0].text || "";
        }
      } catch (error) {
        console.error("Error parsing notes:", error);
      }
    });
  },

  save(notesText) {
    const note = { id: "user-notes", text: notesText };
    
    const xhr = new FAJAX();
    xhr.send({ type: "POST", url: "/notes", data: note }, (response) => {
      try {
        const res = JSON.parse(response);
        if (res && res.message === "Data received!") {
          console.log("Notes saved successfully");
        } else {
          console.error("Failed to save notes");
        }
      } catch (error) {
        console.error("Error parsing response:", error);
        alert("❌ Failed to save notes. Please try again.");
      }
    });
  }
};

// Export functions for global access if needed
window.loadNotes = NoteService.load;
window.loadTasks = TaskService.load;