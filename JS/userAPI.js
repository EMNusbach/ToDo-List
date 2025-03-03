const BASE_URL = "http://localhost:3001/users"; // URL of user server (note the change in port)

async function registerUser(username, password, email) {
    const response = await fetch(`${BASE_URL}/register`, {  // Add '/register' to the URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email })  // Include email
    });
    return response.json();
}

async function loginUser(username, password) {
    const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });
    return response.json();
}


