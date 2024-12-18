//Rest APIs for user authentication and registration

import { jwtDecode } from "jwt-decode";
const BASE_URL = "https://dev-project-ecommerce.upgrad.dev/api";

export const doLogin = (email, password) => {
  //Note: we are returning promise so that we can resolve it by using appropriate data type like json or text
  //caller of the function should only be concerned with returned data on success or failure message
  let promiseResolveRef = null;
  let promiseRejectRef = null;
  let promise = new Promise((resolve, reject) => {
    promiseResolveRef = resolve;
    promiseRejectRef = reject;
  });
  fetch(`${BASE_URL}/auth/signin`, {
    method: "POST",
    body: JSON.stringify({
      username: email,
      password: password,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => {
      response
        .json()
        .then((json) => {
          if (response.ok) {
            let token = response.headers.get("x-auth-token");
            let decoded = jwtDecode(token);
            promiseResolveRef({
              username: json.email,
              accessToken: token,
              accessTokenTimeout: decoded.exp * 1000, //convert to epoch
              roles: json.roles,
              userId: json.id,
              response: response,
            });
          } else {
            promiseRejectRef({
              reason: "Server error occurred. Please try again.",
              response: response,
            });
          }
        })
        .catch((error) => {
          promiseRejectRef({
            reason: "Bad Credentials. Please try again.",
            response: error,
          });
        });
    })
    .catch((err) => {
      promiseRejectRef({
        reason: "Some error occurred. Please try again.",
        response: err,
      });
    });
  return promise;
};

export const doSignup = (requestJson) => {
  //Note: we are returning promise so that we can resolve it by using appropriate data type like json or text
  //caller of the function should only be concerned with returned data on success or failure message
  let promiseResolveRef = null;
  let promiseRejectRef = null;
  let promise = new Promise((resolve, reject) => {
    promiseResolveRef = resolve;
    promiseRejectRef = reject;
  });
  fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    body: JSON.stringify(requestJson),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => {
      response
        .json()
        .then((json) => {
          if (response.ok) {
            promiseResolveRef({
              message: json.message,
              response: response,
            });
          } else {
            let message = json.message;
            if (message === undefined || message === null) {
              message = "Server error occurred. Please try again.";
            }
            promiseRejectRef({
              reason: message,
              response: response,
            });
          }
        })
        .catch((err) => {
          promiseRejectRef({
            reason: "Some error occurred. Please try again.",
            response: err,
          });
        });
    })
    .catch((err) => {
      promiseRejectRef({
        reason: "Some error occurred. Please try again.",
        response: err,
      });
    });
  return promise;
};
