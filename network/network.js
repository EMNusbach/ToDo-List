import { GetAll, Get, Put, Post, Delete } from "../server/server.js";

export function sendRequest(method, url, data, callback) {
  const delay = Math.random() * 2000 + 1000;
  const dropProbability = Math.random();

  setTimeout(() => {
    if (dropProbability < 0.2) {
      // request get lost
      console.warn("FAJAX: Request lost in the network simulation.");
      return;
    }

    let response;
    switch (method) {
      case "GETALL":
        response = GetAll(url);
        break;
      case "GET":
        response = Get(url);
        break;
      case "POST":
        response = Post(url, data);
        break;
      case "PUT":
        response = Put(url, data);
        break;
      case "DELETE":
        response = Delete(url, data);
        break;
      default:
        return callback("Unsupported method", null);
    }

    // מחזירים את התשובה אחרי הסימולציה
    callback(null, JSON.stringify(response));
  }, delay);
}
