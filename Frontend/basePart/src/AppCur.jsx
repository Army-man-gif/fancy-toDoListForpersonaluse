import "./App_replacedcss.css";
import Form from "./Form.jsx";
import Buttons from "./Buttons.jsx";
import Task from "./Task.jsx";
import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import {
  getData,
  cleanAll,
  User,
  justLogin,
  batchupdateTasks,
  deleteSpecificTask,
} from "./talkingToBackend.js";
function AppCur() {
  // Setting up the data saving logic and data storage logic
  const [count, setCount] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [currentVal, setValues] = useState([]);
  const [privateBrowsing, setPrivateBrowsing] = useState(null);
  function isPrivateBrowsing() {
    try {
      localStorage.setItem("__test__", "1");
      localStorage.removeItem("__test__");
      setPrivateBrowsing(false);
    } catch {
      setPrivateBrowsing(true);
    }
  }

  useEffect(() => {
    isPrivateBrowsing();
  }, []);
  useEffect(() => {
    (async () => {
      if (privateBrowsing !== null) {
        let username;
        let Tasks;
        if (privateBrowsing) {
          username = JSON.parse(sessionStorage.getItem("username")) || "";
          Tasks = JSON.parse(sessionStorage.getItem("Tasks")) || [];
        } else {
          username = JSON.parse(localStorage.getItem("username")) || "";
          Tasks = JSON.parse(localStorage.getItem("Tasks")) || [];
        }
        if (username === "") {
          await User(username);
        } else {
          await justLogin(username);
        }
        if (Object.keys(Tasks).length === 0) {
          await fetchData();
        } else {
          pullFromLocal();
          await batchupdateTasks();
        }
      }
    })();
  }, [privateBrowsing]);
  function pullFromLocal() {
    try {
      let pulled;
      if (privateBrowsing) {
        pulled = JSON.parse(sessionStorage.getItem("Tasks")) || [];
      } else {
        pulled = JSON.parse(localStorage.getItem("Tasks")) || [];
      }

      let result = [];

      if (Object.keys(pulled).length !== 0) {
        result = pulled;
        setValues(result);
      } else {
        setValues(result);
      }
      if (!privateBrowsing) {
        localStorage.setItem("tasksToUpdate", JSON.stringify(result));
      } else {
        sessionStorage.setItem("tasksToUpdate", JSON.stringify(result));
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  }
  async function fetchData() {
    let savedTasks = await getData();
    try {
      if (savedTasks) {
        setValues(savedTasks);
      } else {
        savedTasks = [];
        setValues(savedTasks);
      }
      if (privateBrowsing) {
        sessionStorage.setItem("Tasks", JSON.stringify(savedTasks));
        sessionStorage.setItem("tasksToUpdate", JSON.stringify(savedTasks));
      } else {
        localStorage.setItem("Tasks", JSON.stringify(savedTasks));
        localStorage.setItem("tasksToUpdate", JSON.stringify(savedTasks));
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  }

  // Clearing storage logic
  const [storageCleared, setStorageCleared] = useState(false);
  async function handleClearStorage() {
    const admin = prompt("Enter secret admin password");
    if (admin !== "1234") {
      alert("You don't have permission to clear the cloud storage");
    } else {
      try {
        await cleanAll();
        setValues([]);
        setStorageCleared(true);
        if (!privateBrowsing) {
          localStorage.setItem("Tasks", JSON.stringify([]));
          localStorage.removeItem("username");
        } else {
          sessionStorage.setItem("Tasks", JSON.stringify([]));
          sessionStorage.removeItem("username");
        }
      } catch (error) {
        console.error("Failed to clear Firestore:", error);
      }
    }
  }

  useEffect(() => {
    if (storageCleared) {
      setTimeout(() => {
        setStorageCleared(false);
      }, 300);
    }
  }, [storageCleared]);

  // Edit tasks
  function editTask(name, newName) {
    const editedTasks = currentVal.map((task) => {
      if (name === task.name) {
        return { ...task, name: newName };
      }
      return task;
    });
    setValues(editedTasks);
    if (!privateBrowsing) {
      localStorage.setItem("tasksToUpdate", JSON.stringify(editedTasks));
      localStorage.setItem("Tasks", JSON.stringify(editedTasks));
    } else {
      sessionStorage.setItem("tasksToUpdate", JSON.stringify(editedTasks));
      sessionStorage.setItem("Tasks", JSON.stringify(editedTasks));
    }
  }

  // Delete tasks
  async function deleteTask(name) {
    const remainingTasks = currentVal.filter((task) => name !== task.name);
    setValues(remainingTasks);
    await deleteSpecificTask(name);
    if (!privateBrowsing) {
      localStorage.setItem("tasksToUpdate", JSON.stringify(remainingTasks));
      localStorage.setItem("Tasks", JSON.stringify(remainingTasks));
    } else {
      sessionStorage.setItem("tasksToUpdate", JSON.stringify(remainingTasks));
      sessionStorage.setItem("Tasks", JSON.stringify(remainingTasks));
    }
  }

  // Add tasks
  async function addTask(name) {
    if (name != "") {
      const newValue = {
        id: nanoid(),
        name: name,
        isChecked: false,
        myDay: false,
        isStarred: false,
      };
      setValues([...currentVal, newValue]);
      if (!privateBrowsing) {
        localStorage.setItem(
          "tasksToUpdate",
          JSON.stringify([...currentVal, newValue]),
        );
        localStorage.setItem(
          "Tasks",
          JSON.stringify([...currentVal, newValue]),
        );
      } else {
        sessionStorage.setItem(
          "tasksToUpdate",
          JSON.stringify([...currentVal, newValue]),
        );
        sessionStorage.setItem(
          "Tasks",
          JSON.stringify([...currentVal, newValue]),
        );
        await batchupdateTasks();
      }
    } else {
      alert("You must enter a task");
    }
  }
  // myDay logic
  function toggleTomyDay(name) {
    const updatedTasks = currentVal.map((task) => {
      if (name === task.name) {
        return { ...task, myDay: !task.myDay };
      }
      return task;
    });
    setValues(updatedTasks);
    if (!privateBrowsing) {
      localStorage.setItem("tasksToUpdate", JSON.stringify(updatedTasks));
      localStorage.setItem("Tasks", JSON.stringify(updatedTasks));
    } else {
      sessionStorage.setItem("tasksToUpdate", JSON.stringify(updatedTasks));
      sessionStorage.setItem("Tasks", JSON.stringify(updatedTasks));
    }
  }
  // starred logic
  function toggleStarred(name) {
    const updatedTasks = currentVal.map((task) => {
      if (name === task.name) {
        return { ...task, isStarred: !task.isStarred };
      }
      return task;
    });
    setValues(updatedTasks);
    if (!privateBrowsing) {
      localStorage.setItem("tasksToUpdate", JSON.stringify(updatedTasks));
      localStorage.setItem("Tasks", JSON.stringify(updatedTasks));
    } else {
      sessionStorage.setItem("tasksToUpdate", JSON.stringify(updatedTasks));
      sessionStorage.setItem("Tasks", JSON.stringify(updatedTasks));
    }
  }
  // Tasks completed logic
  const [showConfetti, setShowConfetti] = useState(false);

  function toggleTaskCompleted(name) {
    let confetti = true;
    const updatedTasks = currentVal.map((task) => {
      if (name === task.name && task.isChecked) {
        confetti = false;
      }
      if (name === task.name) {
        return { ...task, isChecked: !task.isChecked };
      }
      return task;
    });
    setValues(updatedTasks);
    if (!privateBrowsing) {
      localStorage.setItem("tasksToUpdate", JSON.stringify(updatedTasks));
      localStorage.setItem("Tasks", JSON.stringify(updatedTasks));
    } else {
      sessionStorage.setItem("tasksToUpdate", JSON.stringify(updatedTasks));
      sessionStorage.setItem("Tasks", JSON.stringify(updatedTasks));
    }
    if (confetti) {
      setShowConfetti(true);
    } else {
      setShowConfetti(false);
    }
  }

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000); // confetti for 3 seconds
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  // App filtering tasks logic

  let countNoun = "tasks";
  let countNoun2 = "tasks";
  // Set up the different filters
  const [filter, setFilter] = useState("All");
  const FILTER_MAP = {
    All: () => true,
    Active: (task) => !task.isChecked,
    Completed: (task) => task.isChecked,
    Clear_Storage: () => true,
    MyDay: (task) => task.myDay,
    importantTasks: (task) => task.isStarred && !task.isChecked,
  };
  const FILTER_NAMES = Object.keys(FILTER_MAP);

  // Making the filter buttons
  const filterList = FILTER_NAMES.map((name) => (
    <Buttons
      key={name}
      val={name}
      isPressed={name === filter}
      setFilter={setFilter}
      setValues={setValues}
      handleClearStorage={handleClearStorage}
    />
  ));
  const filteredEls = currentVal.filter(FILTER_MAP[filter]);
  useEffect(() => {
    setCount(filteredEls.length);
  }, [filteredEls.length]);
  // Filter tasks based on chosen filter

  // Recalculate number of tasks and adjust the naming conventions based on it
  if (count == 1) {
    countNoun = "task";
  }
  if (completed == 1) {
    countNoun2 = "task";
  }
  let empty = false;
  if (count == 0) {
    empty = true;
  }

  /* 
  Simple refocus logic. Just refocus the input field 
  when the user clicks on the task list
  */
  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }
  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(count);
  useEffect(() => {
    if (count < prevTaskLength) {
      listHeadingRef.current.focus();
    }
  }, [count, prevTaskLength]);

  function detectHyperlink(element) {
    const hyperlinkExists =
      element.includes("https") || element.includes("http");
    if (hyperlinkExists) {
      const indexStart = element.indexOf("http");
      const link = element.substring(indexStart);
      const text = element.substring(0, indexStart).trim();
      const alias = link.split("/")[2] || "link";
      return { text, link, alias };
    } else {
      return null;
    }
  }
  useEffect(() => {
    if (filter == "MyDay") {
      let countCompleted = 0;
      filteredEls.forEach((el) => {
        console.log(el.isChecked);
        if (el.isChecked) {
          countCompleted++;
        }
      });
      setCompleted(countCompleted);
      setCount(filteredEls.length - countCompleted);
    }
  }, [currentVal, filter]);
  // Renders everything using all the logic functions above and in other files
  return (
    <div className="todoapp stack-la  rge">
      <h1>Personal To Do list</h1>
      {showConfetti && (
        <div id="confetti">
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={800}
            gravity={0.95}
          />
        </div>
      )}
      <Form type="text" addTask={addTask} />
      <div className="filtering filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {filter == "MyDay" ? (
          <>
            {completed} {countNoun2} completed
            <br />
          </>
        ) : (
          <></>
        )}
        {!empty ? (
          <>
            {count} {countNoun} remaining
          </>
        ) : (
          <>No tasks remaining</>
        )}
      </h2>

      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {filteredEls.map((task, index) => (
          <li key={task.id || task.name} className="todo stack-small">
            <Task
              name={task.name}
              myDay={task.myDay}
              isStarred={task.isStarred}
              isChecked={task.isChecked}
              toggleTaskCompleted={toggleTaskCompleted}
              deleteTask={deleteTask}
              editTask={editTask}
              detectHyperlink={detectHyperlink}
              toggleTomyDay={toggleTomyDay}
              toggleStarred={toggleStarred}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AppCur;
