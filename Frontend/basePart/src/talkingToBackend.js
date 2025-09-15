const intialBackendString = "https://workoutsBackend-qta1.onrender.com/records";

async function getCSRFToken() {
  const fetchTheData = await fetch(`${intialBackendString}/getToken/`, {
    method: "GET",
    credentials: "include",
  });
  const cookiesData = await fetchTheData.json();
  return cookiesData.csrftoken;
}
function isPrivateBrowsing() {
  try {
    localStorage.setItem("__test__", "1");
    localStorage.removeItem("__test__");
    return false;
  } catch {
    return true;
  }
}
function authenticationHeaders() {
  const sessionid = JSON.parse(sessionStorage.getItem("sessionid"));
  const csrftoken = JSON.parse(sessionStorage.getItem("csrftoken"));

  return {
    "Content-Type": "application/json",
    "X-SESSIONID": sessionid || "",
    "X-CSRFToken": csrftoken || "",
  };
}
export async function SendData(url, data = {}) {
  let response;
  try {
    const sendData = await fetch(url, {
      method: "POST",
      headers: authenticationHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });
    const contentType = sendData.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      response = await sendData.json();
    } else {
      response = await sendData.text();
    }
    if (sendData.ok) {
      //console.log("Server responded with: ", response);
      sessionStorage.setItem("Logged-In", true);
    } else {
      console.log("Server threw an error", response);
    }
  } catch (error) {
    console.log("Error: ", error);
  }
  return response;
}

export async function User(name = "") {
  if (name == "") {
    let loop = false;

    do {
      name = prompt("Enter username: ").trim();
      if (name == "") {
        alert("You must enter something");
        loop = true;
      } else if (name == null) {
        alert("You can't cancel");
        loop = true;
      } else {
        loop = false;
      }
    } while (loop);
  }
  const data = { username: name };
  const csrftoken = await getCSRFToken();
  sessionStorage.setItem("csrftoken", JSON.stringify(csrftoken));
  const user = await SendData(`${intialBackendString}/GetorMakeUser/`, data);
  if (user["status"]) {
    const sessionid = user["sessionid"];
    sessionStorage.setItem("sessionid", JSON.stringify(sessionid));
    if (!isPrivateBrowsing()) {
      localStorage.setItem("username", JSON.stringify(user["username"]));
    } else {
      sessionStorage.setItem("username", JSON.stringify(user["username"]));
    }
  } else {
    console.log("Login failed");
  }
}
export async function justLogin(name) {
  const data = { username: name };
  const csrftoken = await getCSRFToken();
  sessionStorage.setItem("csrftoken", JSON.stringify(csrftoken));
  const user = await SendData(`${intialBackendString}/login/`, data);
  if (user.message) {
    const sessionid = user["sessionid"];
    sessionStorage.setItem("sessionid", JSON.stringify(sessionid));
  } else {
    console.log("Login failed");
  }
}

export async function batchupdateTasks() {
  let stored = {};
  let privateBrowsing = false;
  if (!isPrivateBrowsing()) {
    stored = JSON.parse(localStorage.getItem("tasksToUpdate")) || {};
  } else {
    stored = JSON.parse(sessionStorage.getItem("tasksToUpdate")) || {};
    privateBrowsing = true;
  }
  const data = { batchUpdate: stored };
  const updateInBulk = await SendData(
    `${intialBackendString}/batchupdateExercise/`,
    data,
  );
  if (updateInBulk.message) {
    if (!privateBrowsing) {
      localStorage.setItem("tasksToUpdate", JSON.stringify({}));
    } else {
      sessionStorage.setItem("tasksToUpdate", JSON.stringify({}));
    }
  } else {
    console.log(updateInBulk.error);
  }
}
export async function logout() {
  const loggingout = await SendData(`${intialBackendString}/logout/`);
  if (loggingout.message) {
    console.log("Logged out");
  }
}
export async function getData() {
  const getItAll = (await SendData(`${intialBackendString}/getData/`)) || {};
  if (getItAll) {
    if (getItAll["message"]) {
      if (!isPrivateBrowsing()) {
        localStorage.setItem("data", JSON.stringify(getItAll["data"]));
      } else {
        sessionStorage.setItem("data", JSON.stringify(getItAll["data"]));
      }
    } else {
      if (!isPrivateBrowsing()) {
        localStorage.setItem("data", JSON.stringify({}));
      } else {
        sessionStorage.setItem("data", JSON.stringify({}));
      }
    }
  }
}
export async function cleanEverything() {
  const cleanAll = await SendData(`${intialBackendString}/cleanAll/`);
  if (cleanAll.message) {
    console.log("Deleted all");
  }
}
export async function deleteSpecificTask(id) {
  const data = { id: id };
  const deleteSpecific = await SendData(
    `${intialBackendString}/deleteSpecific/`,
    data,
  );
  if (deleteSpecific.message) {
    console.log("Deleted task");
  }
}
