import FAJAX from "../../network/FAJAX.js";

document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTask");

  addTaskBtn.addEventListener("click", function () {
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

  TaskService.load();
  //NoteService.load();
});

const TaskService = {
  load() {
    const taskList = document.getElementById("taskList");
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
    const taskItem = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.isCompleted;
    checkbox.addEventListener("change", () => {
      task.isCompleted = checkbox.checked;
      // task.isCompleted = !task.isCompleted;
      TaskService.update(task);
    });

    const taskText = document.createElement("span");
    taskText.textContent = task.text;

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

// const NoteService = {
//   load() {
//     const noteList = document.getElementById("noteList");
//     noteList.innerHTML = "";
//     const xhr = new FAJAX();
//     xhr.send({ type: "GET", url: "/notes" }, (response) => {
//       try {
//         const notes = JSON.parse(response);
//         console.table(notes);
//         notes.forEach(NoteUI.add);
//       } catch (error) {
//         console.error("Error parsing notes:", error);
//         alert("❌ Failed to load notes. Please try again.");
//       }
//     });
//   },

//   update(note) {
//     const xhr = new FAJAX();
//     xhr.send({ type: "PUT", url: `/notes`, data: note }, (response) => {
//       if (xhr.status === 200 && xhr.readyState === 4) {
//         try {
//           const res = JSON.parse(response);
//           console.log("Update response:", res);
//           if (res && res.message === "Item updated") {
//             console.log(`Note with ID ${note} updated successfully.`);
//             this.load();
//           } else {
//             console.error(
//               `Failed to update note with ID ${note.id}:`,
//               res.error
//             );
//           }
//         } catch (error) {
//           console.error("Error parsing update response:", error);
//         }
//       }
//     });
//   },

//   delete(note) {
//     const xhr = new FAJAX();
//     xhr.send(
//       { type: "DELETE", url: `/notes/${note.id}`, data: note.id },
//       (response) => {
//         if (xhr.status === 200 && xhr.readyState === 4) {
//           try {
//             const res = JSON.parse(response);
//             if (res && res.message === "Item deleted") {
//               console.log(`Note with ID ${note.id} deleted successfully.`);
//               this.load();
//             } else {
//               console.error(
//                 `Failed to delete note with ID ${note.id}:`,
//                 res.error
//               );
//             }
//           } catch (error) {
//             console.error("Error parsing delete response:", error);
//             alert("❌ Failed to delete note. Please try again.");
//           }
//         }
//       }
//     );
//   },
// };

// const NoteUI = {
//   update(note) {
//     const xhr = new FAJAX();
//     xhr.send({ type: "PUT", url: `/notes`, data: note }, (response) => {
//       if (xhr.status === 200 && xhr.readyState === 4) {
//         try {
//           const res = JSON.parse(response);
//           console.log("Update response:", res);
//           if (res && res.message === "Item updated") {
//             console.log(`Note with ID ${note} updated successfully.`);
//             this.load();
//           } else {
//             console.error(
//               `Failed to update note with ID ${note.id}:`,
//               res.error
//             );
//           }
//         } catch (error) {
//           console.error("Error parsing update response:", error);
//         }
//       }
//     });
//   },
// };

window.loadNotes = NoteService.load;
window.loadTasks = TaskService.load;
