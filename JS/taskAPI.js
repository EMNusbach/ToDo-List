const BASE_URL = "http://localhost:3002/tasks_notes"; // URL of task and note server

// Get all tasks and notes for a user
async function getTasksAndNotes(username) {
    const response = await fetch(`${BASE_URL}/${username}`);
    return response.json();
}

// Add a new task
async function addTask(username, task) {
    const response = await fetch(`${BASE_URL}/${username}/task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task)
    });
    return response.json();
}

// Add a new note
async function addNote(username, note) {
    const response = await fetch(`${BASE_URL}/${username}/note`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note)
    });
    return response.json();
}

// Update a task
async function updateTask(username, taskId, updatedTask) {
    const response = await fetch(`${BASE_URL}/${username}/task/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask)
    });
    return response.json();
}

// Update a note
async function updateNote(username, noteId, updatedNote) {
    const response = await fetch(`${BASE_URL}/${username}/note/${noteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedNote)
    });
    return response.json();
}

// Delete a task
async function deleteTask(username, taskId) {
    await fetch(`${BASE_URL}/${username}/task/${taskId}`, {
        method: "DELETE"
    });
}

// Delete a note
async function deleteNote(username, noteId) {
    await fetch(`${BASE_URL}/${username}/note/${noteId}`, {
        method: "DELETE"
    });
}
