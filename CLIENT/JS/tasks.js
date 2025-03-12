// @ts-nocheck
import FAJAX from "../../network/FAJAX.js";

/**
 * Tasks Page Controller
 * Manages the task list functionality with improved organization
 */
class TasksPageController {
  constructor() {
    this.initialized = false;
    this.elements = {
      // taskInput: null,
      addTaskBtn: null,
      saveNotesBtn: null,
      notesTextarea: null,
      taskList: null,
    };

    // Bind methods to maintain 'this' context
    this.init = this.init.bind(this);
    this.reset = this.reset.bind(this);
    this.setupEventListeners = this.setupEventListeners.bind(this);

    // Setup page lifecycle handlers
    window.addEventListener("hashchange", this.reset);
    document.addEventListener("DOMContentLoaded", () => {
      const appContainer = document.getElementById("app-container");
      if (appContainer) {
        const observer = new MutationObserver(this.handleDOMChanges.bind(this));
        observer.observe(appContainer, { childList: true, subtree: true });
      }
    });
  }

  /**
   * Initialize the tasks page
   */
  init() {
    if (this.initialized) return;

    // Cache DOM elements
    this.elements = {
      // taskInput: document.getElementById("taskInput"),
      addTaskBtn: document.getElementById("addTask"),
      saveNotesBtn: document.getElementById("saveNotes"),
      notesTextarea: document.querySelector(".notes"),
      taskList: document.getElementById("taskList"),
    };

    if (!this.elements.addTaskBtn) {
      console.error("Task page elements not found");
      return;
    }

    this.setupEventListeners();

    // Load initial data
    taskService.load();
    noteService.load();

    this.initialized = true;
    console.log("Tasks page initialized");
  }

  /**
   * Reset initialization when leaving the tasks page
   */
  reset() {
    if (location.hash !== "#tasksPage") {
      this.initialized = false;
      console.log("Tasks page initialization reset");
    }
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Add task handler
    this.elements.addTaskBtn.addEventListener("click", () => {
      // const taskText = this.elements.taskInput.value.trim();
      // add an empty task
      taskService.addEmptyTask();
    });

    // Save notes handler
    if (this.elements.notesTextarea) {
      // Save on Enter key (Ctrl+Enter or Shift+Enter to add new line)
      this.elements.notesTextarea.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
          e.preventDefault(); // Prevent new line
          const notes = this.elements.notesTextarea.value;
          noteService.save(notes);
        }
      });
    }
  }

  /**
   * Handle DOM mutations to initialize page when elements are available
   */
  handleDOMChanges(mutations) {
    if (location.hash === "#tasksPage" && !this.initialized) {
      //   const taskInput = document.getElementById("taskInput");
      const addTaskBtn = document.getElementById("addTask");

      if (addTaskBtn) {
        // Small delay for DOM to settle
        setTimeout(this.init, 50);
      }
    }
  }
}

/**
 * Task Service
 * Handles task data operations with the server
 */
const taskService = {
  addEmptyTask() {
    const emptyTask = {
      id: `${Date.now()}`,
      text: "",
      isCompleted: false,
      usersId: sessionStorage.getItem("usersId")
    };
    taskUI.add(emptyTask);
  },

  load() {
    const taskList = document.getElementById("taskList");
    if (!taskList) return;

    taskList.innerHTML = "";
    const xhr = new FAJAX();
    xhr.send(
      {
        type: "GETALL",
        url: "/tasks",
      },
      () => {
        try {
          const tasks = JSON.parse(xhr.responseText);
          console.log("Tasks loaded:", tasks.length);

          // Display existing tasks
          tasks.forEach(taskUI.add);

          // Add empty task slots until we have 10 total
          const remainingSlots = 8 - tasks.length;
          if (remainingSlots > 0) {
            for (let i = 0; i < remainingSlots; i++) {
              taskService.addEmptyTask();
            }
          }
        } catch (error) {
          console.error("Error parsing tasks:", error);
          alert("❌ Failed to load tasks. Please try again.");
        }
      }
    );
  },


  delete(taskId, callback) {
    const xhr = new FAJAX();
    xhr.send(
      {
        type: "DELETE",
        url: `/tasks/${taskId}`,
        data: taskId,
      },
      () => {
        const success = xhr.status === 200 && xhr.readyState === 4;
        if (success) {
          console.log(`Task with ID ${taskId} deleted successfully.`);
          //addEmptyTask();
          this.load();
        } else {
          console.error("Failed to delete task");
          alert("❌ Failed to delete task. Please try again.");
        }
        callback(success);
      }
    );
  },

  update(task) {
    const xhr = new FAJAX();
    xhr.send(
      {
        type: "PUT",
        url: `/tasks/${task.id}`,
        data: task,
      },
      () => {
        if (xhr.status === 200 && xhr.readyState === 4) {
          console.log(`Task with ID ${task.id} updated successfully.`);
          this.load();
        } else {
          console.error("Failed to update task");
        }
      }
    );
  },
};

/**
 * Task UI
 * Handles the display and UI interactions for tasks
 */

const taskUI = {
  add(task) {
    const taskList = document.getElementById("taskList");
    if (!taskList) return;

    const taskItem = document.createElement("li");
    taskItem.dataset.taskId = task.id;

    // Create task text
    const taskText = document.createElement("span");
    taskText.textContent = task.text;
    taskText.style.textDecoration = task.isCompleted ? "line-through" : "none";
    taskText.style.cursor = "pointer";
    taskText.className = "task-text";

    // Enable inline editing on double click
    taskText.addEventListener("dblclick", () => {
      // Create input element
      const input = document.createElement("input");
      input.type = "text";
      input.value = task.text;
      input.className = "task-edit-input";

      // Replace span with input
      taskText.replaceWith(input);
      input.focus();

      // Handle Enter key press
      input.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
          const newText = input.value.trim();
          if (newText) {
            task.text = newText;
            taskService.update(task);
          }
        }
      });

      // Handle clicking outside the input
      input.addEventListener("blur", () => {
        input.replaceWith(taskText);
      });
    });
    // Create checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.isCompleted;
    checkbox.addEventListener("change", () => {
      task.isCompleted = checkbox.checked;
      taskText.style.textDecoration = task.isCompleted
        ? "line-through"
        : "none";
      taskService.update(task);
    });

    // Create delete button
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.addEventListener("click", () => {
      taskService.delete(task.id, (success) => {
        if (success) {
          taskItem.remove();
        }
      });
    });

    // Add elements to the list item
    taskItem.append(checkbox, taskText);
    if (task.text) {
      taskItem.append(deleteButton);
    }
    taskList.appendChild(taskItem);
  },
};

/**
 * Notes Service
 * Handles note data operations with the server
 */
const noteService = {
  load() {
    const notesTextarea = document.querySelector(".notes");
    if (!notesTextarea) return;

    const xhr = new FAJAX();
    xhr.send(
      {
        type: "GETALL",
        url: "/tasks",
      },
      () => {
        try {
          const notes = JSON.parse(xhr.responseText);
          if (notes && notes.length > 0) {
            notesTextarea.value = notes[0].text || "";
            return;
          }

          // Create empty note if none exists
          this.createEmptyNote(notesTextarea);
        } catch (error) {
          console.error("Error parsing notes:", error);
          alert("❌ Failed to load notes. Please try again.");
        }
      }
    );
  },

  createEmptyNote(textarea) {
    const emptyNote = { 
      id: "user-notes", 
      text: "" ,
      userId: sessionStorage.getItem("userId")};
    const xhr = new FAJAX();

    xhr.send(
      {
        type: "POST",
        url: "/tasks",
        data: emptyNote,
      },
      () => {
        if (xhr.status === 200 && xhr.readyState === 4) {
          console.log("Empty note created successfully");
          textarea.value = "";
        } else {
          console.error("Failed to create empty note");
          alert("❌ Failed to create note. Please try again.");
        }
      }
    );
  },

  save(notesText) {
    const note = { id: "user-notes", text: notesText };
    const xhr = new FAJAX();

    xhr.send(
      {
        type: "PUT",
        url: "/tasks",
        data: note,
      },
      () => {
        if (xhr.status === 200 && xhr.readyState === 4) {
          console.log("Notes saved successfully");
          this.load();
        } else {
          console.error("Failed to save notes");
          alert("❌ Failed to save notes. Please try again.");
        }
      }
    );
  },
};

// Initialize TasksPageController
const tasksPageController = new TasksPageController();

// Export functions for global access if needed
window.loadNotes = noteService.load;
window.loadTasks = taskService.load;
