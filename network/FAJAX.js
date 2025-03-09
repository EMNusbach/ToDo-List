// @ts-nocheck
import { sendRequest } from "./network.js";

const request_status = Object.freeze({
  not_initialized: 0,
  connect: 1,
  received: 2,
  processing: 3,
  done: 4,
});

class FAJAX {
  constructor() {
    this.readyState = request_status.not_initialized;
    this.responseText = "";
    this.status = 0;
  }

  abort() {
    this.readyState = request_status.not_initialized;
  }

  send(request = null, callback) {
    this.readyState = request_status.connect;

    const method = request ? request.type || "GET" : "GET";
    const url = request ? request.url : "mock_url";
    const data = request ? request.data : null;

    sendRequest(method, url, data, (error, response) => {
      if (error) {
        console.error(error);
        this.status = 500;
        this.responseText = error;
      } else {
        this.responseText = response;
        this.status = 200;
      }
      this.readyState = request_status.done;
      if (callback) callback(); // whay need to pass this? why not just callback()?

    });
  }
}

export default FAJAX;
