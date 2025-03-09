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
    let dataPath = `/${parts[1]}`;
    let storedData;
    try {
      storedData = JSON.parse(localStorage.getItem(dataPath));
    } catch (error) {
      console.error("Error parsing stored data:", error);
      return { error: "Error parsing stored data" };
    }
    storedData = storedData.filter((item) => item.id !== itemId); // מסנן את הפריט עם ה-ID המתאים
    if (storedData) {
      localStorage.setItem(dataPath, JSON.stringify(storedData));
      console.log("Deleted item with ID:", itemId);
      return { message: "Item deleted", itemId: itemId };
    } else {
      return { error: "No items found" };
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    return { error: "Error deleting item" };
  }
}
