const intialBackendString = "https://todolist-bueo.onrender.com/list";
async function getCSRFToken() {
  const fetchTheData = await fetch(`${intialBackendString}/getToken/`, {
    method: "GET",
    credentials: "include",
  });
  let response;
  const contentType = fetchTheData.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      response = await fetchTheData.json();
      response = response.csrftoken;
    } catch (jsonError) {
      console.error("Failed to parse JSON:", jsonError);
      response = await fetchTheData.text();
    }
  } else {
    response = await fetchTheData.text();
    console.warn("Received non-JSON response:");
  }
  console.log(response);
  return response;
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
      try {
        response = await sendData.json();
      } catch (jsonError) {
        console.error("Failed to parse JSON:", jsonError);
        response = await sendData.text();
      }
    } else {
      response = await sendData.text();
      console.warn("Received non-JSON response:");
    }
    if (sendData.ok) {
      sessionStorage.setItem("Logged-In", true);
    } else {
      console.log("Server threw an error", response);
    }
  } catch (error) {
    console.log("Error in send data function: ", error);
  }
  console.log("response", response);
  return response;
}

export async function User(name) {
  console.log("Here");
  const csrftoken = await getCSRFToken();
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
    stored = JSON.parse(localStorage.getItem("tasksToUpdate")) || [];
  } else {
    stored = JSON.parse(sessionStorage.getItem("tasksToUpdate")) || [];
    privateBrowsing = true;
  }
  const data = { batchUpdate: stored };
  const updateInBulk = await SendData(
    `${intialBackendString}/batchUpdateTasks/`,
    data,
  );
  if (updateInBulk.message) {
    if (!privateBrowsing) {
      localStorage.setItem("tasksToUpdate", JSON.stringify([]));
    } else {
      sessionStorage.setItem("tasksToUpdate", JSON.stringify([]));
    }
  } else {
    console.log("Error", updateInBulk.error);
  }
}
export async function logout() {
  const loggingout = await SendData(`${intialBackendString}/logout/`);
  if (loggingout.message) {
    console.log("Logged out");
  }
}
export async function getData() {
  const getItAll = (await SendData(`${intialBackendString}/getData/`)) || [];
  if (getItAll) {
    if (getItAll["message"]) {
      return getItAll["Tasks"];
    } else {
      return [];
    }
  }
}
export async function cleanAll() {
  const cleanAll = await SendData(`${intialBackendString}/cleanAll/`);
  if (cleanAll.message) {
    console.log("Deleted all");
  }
}
export async function deleteSpecificTask(name) {
  const data = { name: name };
  const deleteSpecific = await SendData(
    `${intialBackendString}/deleteSpecific/`,
    data,
  );
  if (deleteSpecific.message) {
    console.log("Deleted task");
  }
}
