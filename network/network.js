import {
  task_GetAll, task_Get, task_Put, task_Post, task_Delete} from "../SERVER/task_server.js";
import { user_GetAll, user_Get, user_Post } from "../SERVER/user_server.js";

export function sendRequest(method, url, data, callback) {
  const delay = Math.random() * 2000 + 1000;
  const dropProbability = Math.random();

  setTimeout(() => {
    let response;
    if (dropProbability < 0.2) {
      // request get lost
      console.warn("FAJAX: Request lost in the network simulation.");

      return callback("Request lost in the network simulation", null);
    }

    if (url === "/users") {
      switch (method) {
        case "GETALL":
          response = user_GetAll(url);
          break;
        case "GET":
          response = user_Get(url, data);
          break;
        case "POST":
          response = user_Post(url, data);
          break;
        default:
          return callback("Unsupported method", null);
      }
    } else {
      switch (method) {
        case "GETALL":
          response = task_GetAll(url);
          break;
        case "GET":
          response = task_Get(url, data);
          break;
        case "POST":
          response = task_Post(url,data);
          break;
        case "PUT":
          response = task_Put(url,data);
          break;
        case "DELETE":
          response = task_Delete(url,data);
          break;
        default:
          return callback("Unsupported method", null);
      }
    }

    callback(null, JSON.stringify(response));
  }, delay);
}


