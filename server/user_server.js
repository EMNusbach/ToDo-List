// @ts-nocheck
export function handleRequest(methode, url, data){



}
//Retrieves all items from a specified collection in localStorage
export function user_GetAll(url) {
    try {
      const storedData = localStorage.getItem(url);
      return storedData ? JSON.parse(storedData) : [];
    } catch (error) {
      console.error(`Error retrieving collection '${url}' from localStorage:`, error);
      return [];
    }
}
  

//Gets a specific user from localStorage for login
export function user_Get(url, credentials) {
    try {
        // Validate input
        if (!credentials || !credentials.username || !credentials.password) {
        return { error: "Missing username or password", status: 400 };
        }

        // Get users from localStorage
        const users = user_GetAll(url);
        
        // Find matching user
        const user = users.find(u => 
        u.username === credentials.username && 
        u.password === credentials.password
        );
        
        if (!user) {
        return { error: "Invalid username or password", status: 401 };
        }
        
        // Return user info (without password)
        const { password, ...userWithoutPassword } = user;
        return {
        message: "Login successful",
        user: userWithoutPassword,
        status: 200
        };
    } catch (error) {
        console.error(`Error during login:`, error);
        return { error: "Login failed", status: 500 };
    }
}
  

//Adds a new user to localStorage
export function user_Post(url, data) {
    try {
      // Validate input
      if (!data || !data.username || !data.email || !data.password ) {
        return { error: "Missing required fields", status: 400 };
      }
  
      console.log("Registering user:", data.username);
      
      // Load existing users
      const existingUsers = user_GetAll(url);
  
      // Check if username already exists
      const usernameExists = existingUsers.some(user => user.username === data.username);
      if (usernameExists) {
        return { error: "Username already exists", status: 409 };
      }
  
      // Create new user object
      const newUser = {
        id: Date.now().toString(),
        username: data.username,
        email: data.email,
        password: data.password, // In a real app, you should hash this password!
        created: new Date().toISOString()
      };
      
      // Add the new user
      existingUsers.push(newUser);
      
      // Save back to localStorage
      localStorage.setItem(url, JSON.stringify(existingUsers));
      
      // Return success but don't include the password in the response
      const { password, ...userWithoutPassword } = newUser;
      return { 
        message: "User registered successfully", 
        user: userWithoutPassword, 
        status: 201
      };
    } catch (error) {
      console.error(`Error registering user:`, error);
      return { error: "Failed to register user", status: 500 };
    }
}