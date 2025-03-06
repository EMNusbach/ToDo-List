let all = [];

export function GetAll(url) {
  let all = []; // מאפס את הרשימה בכל קריאה
  try {
    const storedData = localStorage.getItem(url);
    if (storedData) {
      all = JSON.parse(storedData); // טוען רק אם יש נתונים
    }
  } catch (error) {
    console.error("Error loading tasks from localStorage:", error);
  }
  return all;
}

export function Get(url) {
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i) === url) {
      return JSON.parse(localStorage.getItem(url));
    }
  }
  return { error: "Not found" };
}

export function Post(url, data) {
  console.log("Received data:", data);

  // נטען את הנתונים הקיימים ונוודא שזה מערך
  let existingData = JSON.parse(localStorage.getItem(url) || "[]");
  if (!Array.isArray(existingData)) {
    existingData = []; // אם זה לא מערך, נאתחל אותו למערך ריק
  }

  // נוסיף את המשימה למערך
  existingData.push(data);
  // נשמור חזרה ל-localStorage
  localStorage.setItem(url, JSON.stringify(existingData));

  return { message: "Data received!", data };
}

export function Put(url, updatedItem) {
  Delete(url, updatedItem.id);
  let parts = url.split("/");
  let tasksPath = `/${parts[1]}`;
  Post(tasksPath, updatedItem);
  return { message: "Item updated", updatedTask: updatedItem };
}

export function Delete(url, itemId) {
  try {
    let parts = url.split("/");
    let tasksPath = `/${parts[1]}`;
    let storedData = JSON.parse(localStorage.getItem(tasksPath));
    let taskObj = storedData.filter((task) => task.id === itemId);
    if (taskObj) {
      storedData = storedData.filter((task) => task.id !== itemId); // מסנן את המשימה עם ה-ID המתאים
      localStorage.setItem(tasksPath, JSON.stringify(storedData));
      console.log("Deleted task with ID:", itemId);
      return { message: "Item deleted", taskId: itemId };
    } else {
      return { error: "No tasks found" };
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    return { error: "Error deleting item" };
  }
}
